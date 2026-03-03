from datetime import datetime

from apps.energy.domain.energy_engine import EnergyEngine
from apps.energy.domain.engine_params import EngineParams, EventDetails
from apps.energy.models import EnergyEvent, ModelParams

from ..constants import MAX_ENERGY, MIN_ENERGY


def clamp_energy(value: float) -> float:
    return min(MAX_ENERGY, max(value, MIN_ENERGY))


def apply_energy_event(
    *,
    user,
    activity,
    started_at: datetime,
    ended_at: datetime,
    subjective_coef: float,
):
    params = ModelParams.objects.order_by("-version").last()
    params = EngineParams(**params.params_json)

    last_event = EnergyEvent.objects.filter(user=user).order_by("-started_at").first()
    initial_energy = last_event.energy_after

    event_details = EventDetails(
        initial_energy=initial_energy,
        event_type=activity.category,
        activity_type=activity.name,
        activity_coef=activity.value,
        started_at=started_at,
        ended_at=ended_at,
        subjective_coef=subjective_coef,
    )

    model = EnergyEngine(params=params, event_details=event_details)
    model.apply()
    print(model.energy)
