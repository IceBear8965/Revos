from rest_framework import serializers

from .constants import ACTIVITY_CODES
from .models import ActivityType


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
        if data["started_at"] >= data["ended_at"]:
            raise serializers.ValidationError(
                {"ended_at": "ended_at must be greater than started_at"}
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
    activity_type = serializers.ChoiceField(choices=ACTIVITY_CODES)
    started_at = serializers.DateTimeField()
    ended_at = serializers.DateTimeField()
    energy_delta = serializers.FloatField()
    subjective_coef = serializers.FloatField()


class EventsListSerializer(serializers.Serializer):
    results = EventItemSerializer(many=True)


class EnergyOverviewActivitiesSerializer(serializers.Serializer):
    date = serializers.DateTimeField()
    energy = serializers.FloatField()


class EnergyOverviewSerializer(serializers.Serializer):
    period = serializers.DictField()
    activities = EnergyOverviewActivitiesSerializer(many=True)


class ActivitiesSummaryDataSerializer(serializers.Serializer):
    activity_type = serializers.ChoiceField(choices=ACTIVITY_CODES)
    avg_energy_delta = serializers.FloatField()
    event_count = serializers.IntegerField()


class ActivitiesSummarySerializer(serializers.Serializer):
    period = serializers.DictField()
    scale = serializers.DictField()
    activities = ActivitiesSummaryDataSerializer(many=True)


class BaseStatisticsSerializer(serializers.Serializer):
    energy_overview = EnergyOverviewSerializer()
    activities_summary = ActivitiesSummarySerializer()
