import pytz
from django.db import transaction
from rest_framework import serializers

from apps.energy.constants import LOAD_ACTIVITIES
from apps.energy.models import EnergyProfile, PersonalActivityProfile

from .constants import INITIAL_ENERGY_CHOICES, INITIAL_ENERGY_MAP
from .models import User


class RegisterUserSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(max_length=16)
    nickname = serializers.CharField(max_length=32)
    timezone = serializers.CharField(max_length=32)
    load_order = serializers.ListField(child=serializers.ChoiceField(choices=LOAD_ACTIVITIES))

    initial_energy_state = serializers.ChoiceField(choices=INITIAL_ENERGY_CHOICES)

    def validate(self, data):
        if set(data.get("load_order")) != set(LOAD_ACTIVITIES):
            raise serializers.ValidationError(
                {"load_order": f"load_order can contain only {LOAD_ACTIVITIES}"}
            )

        if data.get("timezone") not in pytz.all_timezones:
            raise serializers.ValidationError({"timezone": "enter valid timezone"})

        if len(data.get("password")) < 8:
            raise serializers.ValidationError(
                {"password": "password must be at least 8 symbols long"}
            )
        return data

    def create(self, validated_data):
        with transaction.atomic():
            user = User.objects.create(
                email=validated_data["email"],
                nickname=validated_data["nickname"],
                timezone=validated_data["timezone"],
            )
            user.set_password(validated_data["password"])
            user.save()

            current_energy = INITIAL_ENERGY_MAP[validated_data["initial_energy_state"]]

            EnergyProfile.objects.create(user=user, current_energy=current_energy)

            PersonalActivityProfile.objects.create(
                user=user, load_order=validated_data["load_order"]
            )

            return user


class MeSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    email = serializers.EmailField()
    nickname = serializers.CharField()
    timezone = serializers.CharField()
    load_order = serializers.JSONField()


class ChangeNicknameSerializer(serializers.Serializer):
    nickname = serializers.CharField()

    def validate(self, data):
        if data.get("nickname") == "":
            raise serializers.ValidationError({"nickname": "nickname field can't be empty"})
        if len(data.get("nickname")) > 32:
            raise serializers.ValidationError(
                {"nickname": "nickname must be not longer than 32 symbols"}
            )

        return data


class ChangeTimezoneSerializer(serializers.Serializer):
    timezone = serializers.CharField(max_length=48)

    def validate(self, data):
        if data.get("timezone") not in pytz.all_timezones:
            raise serializers.ValidationError({"timezone": "enter correct timezone"})
        return data
