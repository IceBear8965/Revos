from datetime import timedelta

import pytz
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from apps.energy.enums import EventTypeChoices
from apps.energy.models import ActivityType, EnergyEvent, ModelParams
from apps.energy.utils.normalize_dt import normalize_dt
from apps.users.services.create_user import create_user_with_initial_state

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
        user = create_user_with_initial_state(
            email=validated_data["email"],
            password=validated_data["password"],
            nickname=validated_data["nickname"],
            initial_energy_state=validated_data["initial_energy_state"],
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
