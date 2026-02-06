from datetime import timedelta

import pytz
from django.utils import timezone

from ..models import EnergyEvent


def generate_events_list(*, user) -> dict:
    user_timezone = pytz.timezone(user.timezone)

    week_ago = timezone.now() - timedelta(days=7)

    energy_objects = EnergyEvent.objects.filter(user=user, started_at__gte=week_ago).order_by(
        "-started_at"
    )

    output = []

    for energy_object in energy_objects:
        id = energy_object.id
        event_type = energy_object.event_type
        activity_type = energy_object.activity_type
        started_at = energy_object.started_at
        ended_at = energy_object.ended_at
        energy_delta = energy_object.energy_delta
        subjective_coef = energy_object.subjective_coef

        output_dict = {
            "id": id,
            "event_type": event_type,
            "activity_type": activity_type,
            "started_at": started_at.astimezone(user_timezone).isoformat(),
            "ended_at": ended_at.astimezone(user_timezone).isoformat(),
            "energy_delta": energy_delta,
            "subjective_coef": subjective_coef,
        }

        output.append(output_dict)

    return {"results": output}
