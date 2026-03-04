from datetime import timedelta

from django.db.models import Q
from rest_framework import serializers

from .models import ActivityType, EnergyEvent


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

        # Base time check
        if started_at >= ended_at:
            raise serializers.ValidationError(
                {"ended_at": "ended_at must be greater than started_at"}
            )

        # Event must be at least 1 minute long because of model's dE/dt
        if ended_at - started_at < timedelta(minutes=1):
            raise serializers.ValidationError(
                {"ended_at": "Event duration must be at least 1 minute"}
            )

        # Append-only architecture
        last_event = EnergyEvent.objects.filter(user=user).order_by("-started_at").first()

        if last_event:
            if started_at < last_event.ended_at:
                raise serializers.ValidationError(
                    {"started_at": "New event must start after the last event ends"}
                )

        return data


class EnergyDashboardSerializer(serializers.Serializer):
    greeting = serializers.CharField()
    current_energy = serializers.FloatField()
    message = serializers.JSONField()
    recommendation = serializers.CharField()
    last_event = serializers.JSONField()


class EventItemSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    event_type = serializers.ChoiceField(choices=["load", "recovery"])
    activity_type = serializers.PrimaryKeyRelatedField(queryset=ActivityType.objects.none())
    started_at = serializers.DateTimeField()
    ended_at = serializers.DateTimeField()
    energy_delta = serializers.FloatField()
    subjective_coef = serializers.FloatField()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get("request")
        if request and request.user.is_authenticated:
            self.fields["activity_type"].queryset = ActivityType.objects.filter(user=request.user)


class EventsListSerializer(serializers.Serializer):
    results = EventItemSerializer(many=True)


# class EnergyOverviewActivitiesSerializer(serializers.Serializer):
#     date = serializers.DateTimeField()
#     energy = serializers.FloatField()
#
#
# class EnergyOverviewSerializer(serializers.Serializer):
#     period = serializers.DictField()
#     activities = EnergyOverviewActivitiesSerializer(many=True)
#
#
# class ActivitiesSummaryDataSerializer(serializers.Serializer):
#     activity_type = serializers.ChoiceField(choices=ACTIVITY_CODES)
#     avg_energy_delta = serializers.FloatField()
#     event_count = serializers.IntegerField()
#
#
# class ActivitiesSummarySerializer(serializers.Serializer):
#     period = serializers.DictField()
#     scale = serializers.DictField()
#     activities = ActivitiesSummaryDataSerializer(many=True)
#
#
# class BaseStatisticsSerializer(serializers.Serializer):
#     energy_overview = EnergyOverviewSerializer()
#     activities_summary = ActivitiesSummarySerializer()
