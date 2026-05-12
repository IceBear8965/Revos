from collections import defaultdict

from apps.common.loggers import log_event

from ...models import EnergyEvent
from ...utils.energy_delta import energy_delta
from ...utils.statistics_period import get_week_period


def generate_activities_summary(*, user):
    period = get_week_period(user)

    energy_events = EnergyEvent.objects.filter(
        user=user, started_at__range=(period["week_start_utc"], period["today_utc"])
    ).order_by("started_at")

    events_by_activity = defaultdict(list)
    deltas = []

    for e in energy_events:
        delta = energy_delta(e)

        deltas.append(delta)
        events_by_activity[e.activity_name].append(delta)

    min_delta = min(deltas) if deltas else 0
    max_delta = max(deltas) if deltas else 0

    activities = []

    for activity, activity_deltas in events_by_activity.items():
        if activity == "initial state":
            continue

        avg_delta = sum(activity_deltas)

        activities.append(
            {
                "activity": activity,
                "avg_energy_delta": round(avg_delta, 4),
                "event_count": len(activity_deltas),
            }
        )

    return {
        "period": {
            "type": "week",
            "from": period["week_start"].isoformat(),
            "to": period["today_local"].date().isoformat(),
        },
        "scale": {
            "min": round(min_delta, 4),
            "max": round(max_delta, 4),
        },
        "activities": activities,
    }
