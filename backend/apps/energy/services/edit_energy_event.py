from django.db import transaction

from ..models import EnergyEvent, EnergyProfile
from .apply_energy_event import apply_energy_event


@transaction.atomic
def edit_energy_event(*, user, event_id, event_type, started_at, ended_at, subjective_coef):
    last_event = EnergyEvent.objects.filter(user=user).order_by("-created_at").first()

    if last_event is None:
        return 404

    if last_event.id != event_id:
        return 403

    profile, _ = EnergyProfile.objects.get_or_create(user=user)
    profile.current_energy = last_event.energy_before
    profile.save(update_fields=["current_energy"])

    last_event.delete()

    new_event = apply_energy_event(
        user=user, event_type=event_type, started_at=started_at, ended_at=ended_at, subjective_coef=subjective_coef
    )

    return new_event
