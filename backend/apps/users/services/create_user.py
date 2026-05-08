from datetime import timedelta

from apps.energy.enums import EventTypeChoices
from apps.energy.models import ActivityType, EnergyEvent, ModelParams
from apps.energy.utils.normalize_dt import normalize_dt
from apps.users.constants import INITIAL_ENERGY_MAP
from django.db import transaction
from django.utils import timezone

from ..models import User


def create_user_with_initial_state(*, email, password, nickname, initial_energy_state):
    with transaction.atomic():
        user = User.objects.create(
            email=email,
            nickname=nickname,
            timezone="UTC",
        )
        user.set_password(password)
        user.save()

        current_energy = INITIAL_ENERGY_MAP[initial_energy_state]
        params_version = ModelParams.objects.latest("created_at")

        now = normalize_dt(timezone.now())
        started_at = now - timedelta(minutes=1)
        ended_at = now

        EnergyEvent.objects.create(
            user=user,
            activity=None,
            activity_category=EventTypeChoices.SYSTEM,
            activity_name="initial state",
            activity_coef=1.0,
            subjective_coef=1.0,
            params_version=params_version,
            started_at=started_at,
            ended_at=ended_at,
            energy_before=current_energy,
            energy_after=current_energy,
            acute_before=0.0,
            acute_after=0.0,
            chronic_before=0.0,
            chronic_after=0.0,
        )

        ActivityType.objects.create(
            user=user,
            category=EventTypeChoices.RECOVERY,
            name="sleep",
            value=1.0,
            is_editable=False,
        )

        return user
