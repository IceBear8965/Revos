from collections import defaultdict
from datetime import datetime, timedelta

import pytz

from ...models import EnergyEvent


def generate_energy_overview(*, user):
    user_timezone = pytz.timezone(user.timezone)
    today = datetime.now(user_timezone).date()
    week_start = today - timedelta(6)

    week_start_local = user_timezone.localize(datetime.combine(week_start, datetime.min.time()))
    today_local = user_timezone.localize(datetime.combine(today, datetime.max.time()))

    week_start_utc = week_start_local.astimezone(pytz.UTC)
    today_utc = today_local.astimezone(pytz.UTC)

    energy_events = EnergyEvent.objects.filter(
        user=user, started_at__range=(week_start_utc, today_utc)
    ).order_by("started_at")

    events_by_date = defaultdict(list)
    for e in energy_events:
        local_date = e.started_at.astimezone(user_timezone).date()
        events_by_date[local_date].append(e)

    activities = []
    for i in range(7):
        day = week_start + timedelta(days=i)
        day_events = events_by_date.get(day, [])
        if day_events:
            last_event = day_events[-1]
            energy = round(last_event.energy_after, 4)
        else:
            energy = None
        activities.append({"date": day.isoformat(), "energy": energy})

    output = {
        "period": {
            "type": "week",
            "from": week_start_local.date().isoformat(),
            "to": today_local.date().isoformat(),
        },
        "activities": activities,
    }

    return output
