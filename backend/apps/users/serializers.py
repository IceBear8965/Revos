from datetime import timedelta

import pytz
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from apps.energy.enums import EventTypeChoices
from apps.energy.models import ActivityType, EnergyEvent, ModelParams
from apps.energy.utils.normalize_dt import normalize_dt

from .constants import INITIAL_ENERGY_CHOICES, INITIAL_ENERGY_MAP
from .models import User


class RegisterUserSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(max_length=16)
    nickname = serializers.CharField(max_length=32)
    initial_energy_state = serializers.ChoiceField(INITIAL_ENERGY_CHOICES)

    def validate(self, data):
        if len(data.get("password")) < 8:
            raise serializers.ValidationError(
                {"password": "password must be at least 8 symbols long"}
            )
        return data

    def create(self, validated_data):
        print(validated_data)
        with transaction.atomic():
            user = User.objects.create(
                email=validated_data["email"],
                nickname=validated_data["nickname"],
                timezone=validated_data.get("timezone", "UTC"),
            )

            user.set_password(validated_data["password"])

            user.save()

            current_energy = INITIAL_ENERGY_MAP[validated_data["initial_energy_state"]]

            params_version = ModelParams.objects.latest("created_at")

            now = timezone.now()
            EnergyEvent.objects.create(
                user=user,
                activity=None,
                activity_category=EventTypeChoices.SYSTEM,
                activity_name="initial state",
                activity_coef=1.0,
                subjective_coef=1.0,
                params_version=params_version,
                started_at=normalize_dt(now - timedelta(milliseconds=2)),
                ended_at=normalize_dt(now - timedelta(milliseconds=1)),
                energy_before=current_energy,
                energy_after=current_energy,
                acute_before=0.0,
                acute_after=0.0,
                chronic_before=0.0,
                chronic_after=0.0,
                sleep_minutes=0,
                break_minutes=0,
                continuous_load_minutes=0,
            )

            ActivityType.objects.create(
                user=user, category=EventTypeChoices.RECOVERY, name="sleep", value=1.0
            )

            return user


class MeSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    email = serializers.EmailField()
    nickname = serializers.CharField()
    timezone = serializers.CharField()


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
