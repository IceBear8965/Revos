from collections import defaultdict
from datetime import timedelta

from ...models import EnergyEvent
from ...utils.statistics_period import get_week_period


def generate_energy_overview(*, user):
    period = get_week_period(user)

    energy_events = EnergyEvent.objects.filter(
        user=user, started_at__range=(period["week_start_utc"], period["today_utc"])
    ).order_by("started_at")

    events_by_date = defaultdict(list)

    for e in energy_events:
        local_date = e.started_at.astimezone(period["tz"]).date()
        events_by_date[local_date].append(e)

    activities = []

    for i in range(7):
        day = period["week_start"] + timedelta(days=i)
        day_events = events_by_date.get(day, [])

        if day_events:
            energy = round(day_events[-1].energy_after, 4)
        else:
            energy = None

        activities.append({"date": day.isoformat(), "energy": energy})

    return {
        "period": {
            "type": "week",
            "from": period["week_start"].isoformat(),
            "to": period["today_local"].date().isoformat(),
        },
        "activities": activities,
    }
