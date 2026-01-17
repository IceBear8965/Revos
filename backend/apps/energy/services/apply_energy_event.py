from django.db import transaction

from ..models import EnergyEvent, EnergyProfile

MIN_ENERGY = 0.05
MAX_ENERGY = 1.0

BASE_LOAD_COEF = 0.00005
BASE_RECOVERY_COEF = 0.00003


def clamp_energy(energy):
    return min(MAX_ENERGY, max(energy, MIN_ENERGY))


@transaction.atomic
def apply_energy_event(*, user, event_type, started_at, ended_at, subjective_coef) -> EnergyEvent:
    """
    Тут будет что-то сложное и длинное
    Принять входные данные -> получить EnergyProfile по user -> получить уровень энергии пользователя -> посчитать длительность события -> получить все коэффициенты -> посчитать delta_energy
    -> посчитать energy_after -> создать новое EnergyEvent
    """
    profile, _ = EnergyProfile.objects.get_or_create(user=user)
    duration_sec = int((ended_at - started_at).total_seconds())

    energy_before = profile.current_energy

    if event_type == EnergyEvent.LOAD:
        base_coef = BASE_LOAD_COEF
    else:
        base_coef = BASE_RECOVERY_COEF

    raw_delta = duration_sec * base_coef * subjective_coef

    if event_type == EnergyEvent.LOAD:
        energy_delta = -(raw_delta)
    else:
        energy_delta = raw_delta

    energy_after = clamp_energy(profile.current_energy + energy_delta)

    event = EnergyEvent.objects.create(
        user=user,
        event_type=event_type,
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
