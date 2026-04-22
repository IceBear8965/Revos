from datetime import datetime, timedelta

from django.db import transaction

from apps.energy.domain.energy_engine import EnergyEngine
from apps.energy.domain.engine_params import EngineParams, EventDetails
from apps.energy.domain.errors import EngineParamsNotFound, LastEventNotFound
from apps.energy.models import EnergyEvent, ModelParams

from ..domain.enums import EventType


@transaction.atomic
def create_energy_event(
    *,
    user,
    activity,
    started_at: datetime,
    ended_at: datetime,
    subjective_coef: float,
):
    params = ModelParams.objects.order_by("-version").last()
    last_event = EnergyEvent.objects.filter(user=user).order_by("-started_at").first()
    if not last_event:
        raise LastEventNotFound()
    elif not params:
        raise EngineParamsNotFound()

    engine_params = EngineParams(**params.params_json)
    initial_energy = last_event.energy_after
    initial_acute = last_event.acute_after
    initial_chronic = last_event.chronic_after
    initial_sleep_minutes = last_event.sleep_minutes
    initial_break_minutes = last_event.break_minutes
    initial_continuous_load_minutes = last_event.continuous_load_minutes

    gap = started_at - last_event.ended_at

    if gap > timedelta(minutes=1):
        initial_sleep_minutes = 0
        initial_break_minutes = 0
        initial_continuous_load_minutes = 0

    event_type = EventType(activity.category)

    event_details = EventDetails(
        initial_energy=initial_energy,
        initial_acute=initial_acute,
        initial_chronic=initial_chronic,
        initial_sleep_minutes=initial_sleep_minutes,
        initial_break_minutes=initial_break_minutes,
        initial_continuous_load_minutes=initial_continuous_load_minutes,
        event_type=event_type,
        activity_type=activity.name,
        activity_coef=activity.value,
        started_at=started_at,
        ended_at=ended_at,
        subjective_coef=subjective_coef,
    )

    model = EnergyEngine(params=engine_params, event_details=event_details)
    new_state = model.apply()

    EnergyEvent.objects.create(
        user=user,
        event_type=event_type.value,
        activity_type=activity.name,
        activity_coef=activity.value,
        subjective_coef=subjective_coef,
        params_version=params,
        started_at=started_at,
        ended_at=ended_at,
        energy_before=initial_energy,
        energy_after=new_state["energy"],
        acute_before=initial_acute,
        acute_after=new_state["acute_strain"],
        chronic_before=initial_chronic,
        chronic_after=new_state["chronic_strain"],
        sleep_minutes=new_state["sleep_minutes"],
        break_minutes=new_state["break_minutes"],
        continuous_load_minutes=new_state["continuous_load_minutes"],
    )
