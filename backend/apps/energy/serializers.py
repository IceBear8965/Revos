from datetime import timedelta

from django.db.models import CharField, Q
from django.utils import choices
from rest_framework import serializers

from apps.energy.utils.event_validation import (
    validate_event_edit,
    validate_event_time,
)

from .enums import UserTypeChoices
from .models import ActivityType, EnergyEvent
from .utils.energy_delta import energy_delta


class EnergyEventCreateSerializer(serializers.Serializer):
    activity = serializers.PrimaryKeyRelatedField(queryset=ActivityType.objects.none())
    started_at = serializers.DateTimeField()
    ended_at = serializers.DateTimeField()
    subjective_coef = serializers.FloatField(min_value=0)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get("request")
        if request and request.user.is_authenticated:
            self.fields["activity"].queryset = ActivityType.objects.filter(user=request.user)

    def validate(self, data):
        user = self.context["request"].user
        started_at = data["started_at"]
        ended_at = data["ended_at"]

        validate_event_time(started_at, ended_at)

        last_event = EnergyEvent.objects.filter(user=user).order_by("-ended_at").first()

        if last_event and started_at < last_event.ended_at:
            raise serializers.ValidationError(
                {"started_at": "New event must start after the last event ends"}
            )

        return data


class EnergyEventEditSerializer(serializers.Serializer):
    activity = serializers.PrimaryKeyRelatedField(queryset=ActivityType.objects.none())
    started_at = serializers.DateTimeField()
    ended_at = serializers.DateTimeField()
    subjective_coef = serializers.FloatField(min_value=0)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get("request")
        if request and request.user.is_authenticated:
            self.fields["activity"].queryset = ActivityType.objects.filter(user=request.user)

    def validate(self, data):
        user = self.context["request"].user
        event_id = self.context["view"].kwargs["id"]

        started_at = data["started_at"]
        ended_at = data["ended_at"]

        validate_event_time(started_at, ended_at)

        validate_event_edit(
            user=user,
            event_id=event_id,
            started_at=started_at,
            ended_at=ended_at,
        )

        return data


class ActivityTypeCollectionSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    category = serializers.ChoiceField(choices=UserTypeChoices.choices)
    value = serializers.FloatField()
    is_editable = serializers.BooleanField()


class ActivityTypeCreateSerializer(serializers.Serializer):
    name = serializers.CharField()
    category = serializers.ChoiceField(choices=UserTypeChoices.choices)
    value = serializers.FloatField()

    def validate(self, data):
        user = self.context["request"].user
        name = data["name"]

        if ActivityType.objects.filter(user=user, name=name).exists():
            raise serializers.ValidationError({"name": "Activity with this name already exists"})

        return data


class ActivityTypeEditSerializer(serializers.Serializer):
    name = serializers.CharField()
    category = serializers.ChoiceField(choices=UserTypeChoices.choices)
    value = serializers.FloatField()


class EnergyDashboardSerializer(serializers.Serializer):
    greeting = serializers.CharField()
    current_energy = serializers.FloatField()
    message = serializers.JSONField()
    recommendation = serializers.CharField()
    last_event = serializers.JSONField()


class EventItemSerializer(serializers.ModelSerializer):
    energy_delta = serializers.SerializerMethodField()

    class Meta:
        model = EnergyEvent
        fields = [
            "id",
            "event_type",
            "activity_type",
            "started_at",
            "ended_at",
            "energy_delta",
            "subjective_coef",
        ]

    def get_energy_delta(self, obj):
        return energy_delta(obj)


class EnergyOverviewActivitiesSerializer(serializers.Serializer):
    date = serializers.DateTimeField()
    energy = serializers.FloatField()


class EnergyOverviewSerializer(serializers.Serializer):
    period = serializers.DictField()
    activities = EnergyOverviewActivitiesSerializer(many=True)


class ActivitiesSummaryDataSerializer(serializers.Serializer):
    activity = serializers.CharField()
    avg_energy_delta = serializers.FloatField()
    event_count = serializers.IntegerField()


class ActivitiesSummarySerializer(serializers.Serializer):
    period = serializers.DictField()
    scale = serializers.DictField()
    activities = ActivitiesSummaryDataSerializer(many=True)


class BaseStatisticsSerializer(serializers.Serializer):
    energy_overview = EnergyOverviewSerializer()
    activities_summary = ActivitiesSummarySerializer()
