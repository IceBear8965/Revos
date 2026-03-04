from datetime import datetime

from django.db import transaction

from apps.energy.domain.energy_engine import EnergyEngine
from apps.energy.domain.engine_params import EngineParams, EventDetails
from apps.energy.domain.errors import EngineParamsNotFound, LastEventNotFound
from apps.energy.models import EnergyEvent, ModelParams

from ..constants import MAX_ENERGY, MIN_ENERGY
from ..domain.enums import EventType


def clamp_energy(value: float) -> float:
    return min(MAX_ENERGY, max(value, MIN_ENERGY))


@transaction.atomic
def apply_energy_event(
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

    event_type = EventType(activity.category)

    event_details = EventDetails(
        initial_energy=initial_energy,
        initial_acute=initial_acute,
        initial_chronic=initial_chronic,
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
    )
