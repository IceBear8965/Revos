from django.db import transaction

from apps.energy.domain.energy_engine import EnergyEngine
from apps.energy.domain.engine_params import EngineParams, EventDetails
from apps.energy.domain.errors import LastEventNotFound

from ..models import EnergyEvent


@transaction.atomic
def delete_energy_event(*, user, event_id):
    event = (
        EnergyEvent.objects.select_for_update()
        .select_related("params_version")
        .get(id=event_id, user=user)
    )

    previous_event = (
        EnergyEvent.objects.filter(user=user, started_at__lt=event.started_at)
        .order_by("-started_at")
        .first()
    )

    if not previous_event:
        raise LastEventNotFound()

    events_queue = (
        EnergyEvent.objects.select_for_update()
        .filter(user=user, started_at__gt=event.started_at)
        .select_related("params_version")
        .order_by("started_at", "id")
    )

    event.delete()

    energy_before = previous_event.energy_after
    acute_before = previous_event.acute_after
    chronic_before = previous_event.chronic_after

    sleep_minutes = previous_event.sleep_minutes
    break_minutes = previous_event.break_minutes
    continuous_load_minutes = previous_event.continuous_load_minutes

    params_cache = {}

    for event in events_queue:
        params_version_id = event.params_version.id

        if params_version_id not in params_cache:
            params_cache[params_version_id] = EngineParams(**event.params_version.params_json)

        params = params_cache[params_version_id]

        event_details = EventDetails(
            initial_energy=energy_before,
            initial_acute=acute_before,
            initial_chronic=chronic_before,
            initial_sleep_minutes=sleep_minutes,
            initial_break_minutes=break_minutes,
            initial_continuous_load_minutes=continuous_load_minutes,
            activity_category=event.activity_category,
            activity_name=event.activity_name,
            activity_coef=event.activity_coef,
            started_at=event.started_at,
            ended_at=event.ended_at,
            subjective_coef=event.subjective_coef,
        )

        engine = EnergyEngine(params=params, event_details=event_details)
        result = engine.apply()

        event.energy_before = energy_before
        event.energy_after = result["energy"]

        event.acute_before = acute_before
        event.acute_after = result["acute_strain"]

        event.chronic_before = chronic_before
        event.chronic_after = result["chronic_strain"]

        event.sleep_minutes = result["sleep_minutes"]
        event.break_minutes = result["break_minutes"]
        event.continuous_load_minutes = result["continuous_load_minutes"]

        event.save(
            update_fields=[
                "energy_before",
                "energy_after",
                "acute_before",
                "acute_after",
                "chronic_before",
                "chronic_after",
                "sleep_minutes",
                "break_minutes",
                "continuous_load_minutes",
            ]
        )

        # прокидываем дальше
        energy_before = result["energy"]
        acute_before = result["acute_strain"]
        chronic_before = result["chronic_strain"]

        sleep_minutes = result["sleep_minutes"]
        break_minutes = result["break_minutes"]
        continuous_load_minutes = result["continuous_load_minutes"]
