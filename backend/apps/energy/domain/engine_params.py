from dataclasses import dataclass
from datetime import datetime

from .enums import ActivityCategory


@dataclass
class EngineParams:
    # Clamps
    clamp_min: float
    clamp_max: float

    # Circadian
    circadian_amplitude: float
    circadian_phase_shift: float

    # Strain
    strain_growth_coef: float

    # Load params
    load_energy_rate: float
    load_chronic_growth: float
    load_continuous_factor: float
    acute_smoothing: float
    chronic_power: float

    # Recovery params
    recovery_k_e: float
    recovery_energy_multiplier: float
    recovery_exp_power: float

    recovery_midpoint: float
    recovery_steepness: float

    recovery_acute_decay: float
    recovery_chronic_decay: float

    # Sleep params
    sleep_k: float
    sleep_midpoint_hours: float
    sleep_energy_multiplier: float

    sleep_recovery_midpoint: float
    sleep_recovery_steepness: float

    sleep_acute_decay: float
    sleep_chronic_decay: float


@dataclass
class EventDetails:
    initial_energy: float
    initial_acute: float
    initial_chronic: float
    initial_sleep_minutes: float
    initial_break_minutes: float
    initial_continuous_load_minutes: float
    activity_category: ActivityCategory
    activity_name: str
    activity_coef: float
    started_at: datetime
    ended_at: datetime
    subjective_coef: float
