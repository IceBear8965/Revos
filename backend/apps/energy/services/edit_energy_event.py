from datetime import datetime, timedelta

from django.db import transaction

from apps.energy.domain.energy_engine import EnergyEngine
from apps.energy.domain.engine_params import EngineParams, EventDetails
from apps.energy.domain.errors import EngineParamsNotFound, LastEventNotFound
from apps.energy.models import EnergyEvent, ModelParams

from ..domain.enums import EventType


@transaction.atomic
def edit_energy_event(
    *,
    user,
    activity,
    started_at: datetime,
    ended_at: datetime,
    subjective_coef: float,
):
    print(activity)
