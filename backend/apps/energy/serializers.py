from rest_framework import serializers

from .constants import ACTIVITY_CODES, LOAD_ACTIVITIES


class EnergyEventCreateSerializer(serializers.Serializer):
    activity_type = serializers.ChoiceField(choices=ACTIVITY_CODES)
    started_at = serializers.DateTimeField()
    ended_at = serializers.DateTimeField()
    subjective_coef = serializers.FloatField()

    def validate(self, data):
        if data["started_at"] > data["ended_at"]:
            raise serializers.ValidationError(
                {"ended_at": "ended_at must be greater than started_at"}
            )
        return data


class EnergyEventEditSerializer(serializers.Serializer):
    event_id = serializers.IntegerField()
    activity_type = serializers.ChoiceField(choices=ACTIVITY_CODES)
    started_at = serializers.DateTimeField()
    ended_at = serializers.DateTimeField()
    subjective_coef = serializers.FloatField()

    def validate(self, data):
        if data["started_at"] > data["ended_at"]:
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
    event_id = serializers.IntegerField()
    event_type = serializers.ChoiceField(choices=["load", "recovery"])
    activity_type = serializers.ChoiceField(choices=ACTIVITY_CODES)
    started_at = serializers.DateTimeField()
    ended_at = serializers.DateTimeField()
    energy_delta = serializers.FloatField()


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


class BaseStatisticsSerizlizer(serializers.Serializer):
    energy_overview = EnergyOverviewSerializer()
    activities_summary = ActivitiesSummarySerializer()


class PersonalActivityOrderSerializer(serializers.Serializer):
    load_order = serializers.ListField(child=serializers.ChoiceField(choices=LOAD_ACTIVITIES))

    def validate_load_order(self, value):
        if len(value) != len(set(value)):
            raise serializers.ValidationError("Duplicate activity types are not allowed")

        if set(value) != set(LOAD_ACTIVITIES):
            raise serializers.ValidationError(f"load_order must contain exactly: {LOAD_ACTIVITIES}")

        return value
