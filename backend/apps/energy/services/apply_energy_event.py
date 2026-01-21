from django.db import transaction

from ..constants import BASE_LOAD_COEF, BASE_RECOVERY_COEF, LOAD, MAX_ENERGY, MIN_ENERGY, RECOVERY
from ..domain.errors import ActivityTypeNotFound
from ..models import ActivityType, EnergyEvent, EnergyProfile, PersonalActivityProfile
from .get_personal_activity_coef import get_personal_activity_coef


def clamp_energy(value: float) -> float:
    return min(MAX_ENERGY, max(value, MIN_ENERGY))


@transaction.atomic
def apply_energy_event(
    *,
    user,
    activity_type: str,
    started_at,
    ended_at,
    subjective_coef: float,
) -> EnergyEvent:
    profile, _ = EnergyProfile.objects.get_or_create(user=user)

    try:
        activity = ActivityType.objects.get(code=activity_type)
    except ActivityType.DoesNotExist:
        raise ActivityTypeNotFound()

    event_type = activity.category
    if event_type == LOAD:
        personal_profile = PersonalActivityProfile.objects.get(user=user)
        personal_coef = get_personal_activity_coef(
            personal_profile=personal_profile, activity_type=activity.code
        )
    else:
        personal_coef = 1.0

    base_coef = BASE_LOAD_COEF if event_type == LOAD else BASE_RECOVERY_COEF

    duration_sec = int((ended_at - started_at).total_seconds())
    energy_before = profile.current_energy

    raw_delta = duration_sec * base_coef * activity.activity_coef * personal_coef * subjective_coef
    energy_delta = -raw_delta if event_type == LOAD else raw_delta

    energy_after = clamp_energy(energy_before + energy_delta)

    event = EnergyEvent.objects.create(
        user=user,
        event_type=event_type,
        activity_type=activity.code,
        base_coef=base_coef,
        activity_coef=activity.activity_coef,
        personal_coef=personal_coef,
        subjective_coef=subjective_coef,
        started_at=started_at,
        ended_at=ended_at,
        duration_sec=duration_sec,
        energy_before=energy_before,
        energy_delta=energy_delta,
        energy_after=energy_after,
    )

    profile.current_energy = energy_after
    profile.save(update_fields=["current_energy"])

    return event
