from rest_framework import serializers


class EnergyEventSerializer(serializers.Serializer):
    event_type = serializers.ChoiceField(choices=["load", "recovery"])
    started_at = serializers.DateTimeField()
    ended_at = serializers.DateTimeField()

    def validate(self, data):
        if data["ended_at"] <= data["started_at"]:
            raise serializers.ValidationError("ended_at must be after started_at")
        return data


class EnergyEventCreateSerializer(serializers.Serializer):
    activity_type = serializers.ChoiceField(choices=["work", "study", "society", "sleep", "rest", "sport"])
    started_at = serializers.DateTimeField()
    ended_at = serializers.DateTimeField()
    subjective_coef = serializers.FloatField()

    def validate(self, data):
        if data["started_at"] > data["ended_at"]:
            raise serializers.ValidationError({"ended_at": "ended_at must be greater than started_at"})
        return data


class EnergyEventEditSerializer(serializers.Serializer):
    event_id = serializers.IntegerField()
    event_type = serializers.ChoiceField(choices=["load", "recovery"])
    started_at = serializers.DateTimeField()
    ended_at = serializers.DateTimeField()
    subjective_coef = serializers.FloatField()

    def validate(self, data):
        if data["started_at"] > data["ended_at"]:
            raise serializers.ValidationError({"ended_at": "ended_at must be greater than started_at"})
        return data
