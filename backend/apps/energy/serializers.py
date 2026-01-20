from rest_framework import serializers


class EnergyEventCreateSerializer(serializers.Serializer):
    activity_type = serializers.ChoiceField(
        choices=["work", "study", "society", "sleep", "rest", "sport"]
    )
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
    activity_type = serializers.ChoiceField(
        choices=["work", "study", "society", "sleep", "rest", "sport"]
    )
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
    activity_type = serializers.ChoiceField(
        choices=["work", "study", "society", "sleep", "rest", "sport"]
    )
    started_at = serializers.DateTimeField()
    ended_at = serializers.DateTimeField()
    energy_delta = serializers.FloatField()


class EventsListSerializer(serializers.Serializer):
    results = EventItemSerializer(many=True)


class EnergyOverviewSerializer(serializers.Serializer):
    date = serializers.DateTimeField()
    energy = serializers.FloatField()


class ActivitiesSummarySerializer(serializers.Serializer):
    activity_type = serializers.ChoiceField(
        choices=["work", "study", "society", "sleep", "rest", "sport"]
    )
    avg_energy_delta = serializers.FloatField()
    event_count = serializers.IntegerField()


class BaseStatisticsSerizlizer(serializers.Serializer):
    energy_overview = EnergyOverviewSerializer(many=True)
    activities_summary = ActivitiesSummarySerializer(many=True)
