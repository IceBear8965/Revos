import math
from datetime import datetime, timedelta

from .engine_params import EngineParams, EventDetails
from .enums import EventType


class EnergyEngine:
    def __init__(self, params: EngineParams, event_details: EventDetails):
        self.params = params
        self.event_details = event_details

        self.energy = self.event_details.initial_energy
        self.acute_strain = 0.0
        self.chronic_strain = 0.0

        self.sleep_minutes = 0
        self.break_minutes = 0
        self.continuous_load_minutes = 0

        self.current_activity = None
        self.activity_minutes = 0

        self.dt = timedelta(minutes=1)

    """
    Circadian rythm is being used in all activity types, except of sleep, because if circadial is used for sleep, than energy value will be increasing before about 3 AM and decreasing after it
    """

    def circadian_component(self, current_time: datetime):
        hour = current_time.hour + current_time.minute / 60
        return self.params.circadian_amplitude * math.sin(
            2 * math.pi * (hour + self.params.circadian_phase_shift) / 24
        )

    def micro_step(self, current_time):
        activity_type = self.event_details.activity_type
        activity_coef = self.event_details.activity_coef
        subjective_coef = self.event_details.subjective_coef

        if activity_type != self.current_activity:
            self.current_activity = activity_type
            self.activity_minutes = 0

        self.activity_minutes += 1

        min_energy = self.params.clamp_min
        max_energy = self.params.clamp_max

        circadian_factor = 1.0
        if activity_type != "sleep":
            circadian_factor += self.circadian_component(current_time)

        # Load
        if self.event_details.event_type == EventType.LOAD:
            self.break_minutes = 0
            self.sleep_minutes = 0
            self.continuous_load_minutes += 1

            energy_cost = (
                self.params.load_energy_rate
                * activity_coef
                * (1 + self.chronic_strain)
                * circadian_factor
                * subjective_coef
            )

            self.energy -= energy_cost * (self.energy - min_energy)

            target_acute = self.acute_strain + self.params.strain_growth_coef * activity_coef
            self.acute_strain += self.params.acute_smoothing * (target_acute - self.acute_strain)

            continuous_factor = 1 + (
                self.params.load_continuous_factor * self.continuous_load_minutes
            )

            self.chronic_strain += (
                self.params.load_chronic_growth
                * (self.acute_strain**self.params.chronic_power)
                * continuous_factor
            )

        # Recovery
        else:
            # Sleep
            if self.event_details.activity_type == "sleep":
                self.continuous_load_minutes = 0
                self.break_minutes = 0
                self.sleep_minutes += 1

                t_hours = self.sleep_minutes / 60

                sigmoid_now = 1 / (
                    1
                    + math.exp(-self.params.sleep_k * (t_hours - self.params.sleep_midpoint_hours))
                )

                sigmoid_prev = 1 / (
                    1
                    + math.exp(
                        -self.params.sleep_k * (t_hours - self.params.sleep_midpoint_hours - 1 / 60)
                    )
                )

                delta_sigmoid = sigmoid_now - sigmoid_prev

                self.energy += (
                    self.params.sleep_energy_multiplier
                    * delta_sigmoid
                    * (max_energy - self.energy)
                    * activity_coef
                    * subjective_coef
                )

                recovery_curve = 1 / (
                    1
                    + math.exp(
                        -self.params.sleep_recovery_steepness
                        * (self.activity_minutes - self.params.sleep_recovery_midpoint)
                    )
                )

                self.acute_strain *= 1 - self.params.sleep_acute_decay * recovery_curve
                self.chronic_strain *= 1 - self.params.sleep_chronic_decay * recovery_curve

            # Rest
            else:
                self.continuous_load_minutes = 0
                self.sleep_minutes = 0
                self.break_minutes += 1

                t = self.activity_minutes

                delta_exp = (
                    1 - math.exp(-self.params.recovery_k_e * (t**self.params.recovery_exp_power))
                ) - (
                    1
                    - math.exp(
                        -self.params.recovery_k_e * ((t - 1) ** self.params.recovery_exp_power)
                    )
                )

                strain_factor = 1 / (1 + self.acute_strain)

                self.energy += (
                    self.params.recovery_energy_multiplier
                    * delta_exp
                    * (max_energy - self.energy)
                    * strain_factor
                    * circadian_factor
                    * activity_coef
                    * subjective_coef
                )

                recovery_curve = 1 / (
                    1
                    + math.exp(
                        -self.params.recovery_steepness
                        * (self.activity_minutes - self.params.recovery_midpoint)
                    )
                )

                self.acute_strain *= 1 - self.params.recovery_acute_decay * recovery_curve
                self.chronic_strain *= 1 - self.params.recovery_chronic_decay * recovery_curve

        # Clamps to prevent overflow
        self.energy = max(min_energy, min(self.energy, max_energy))
        self.acute_strain = max(0.0, min(self.acute_strain, 5.0))
        self.chronic_strain = max(0.0, min(self.chronic_strain, 1.5))

    def apply(self):
        current_time = self.event_details.started_at
        while current_time < self.event_details.ended_at:
            self.micro_step(current_time)
            current_time += self.dt

        return {
            "energy": self.energy,
            "acute_strain": self.acute_strain,
            "chronic_strain": self.chronic_strain,
        }
