from collections import defaultdict
from datetime import datetime, timedelta

import pytz

from ...models import EnergyEvent


def generate_energy_overview(*, user):
    user_timezone = pytz.timezone(user.timezone)
    today = datetime.now(user_timezone).date()
    week_start = today - timedelta(6)

    week_start_dt = datetime.combine(week_start, datetime.min.time()).astimezone(user_timezone)
    today_end_dt = datetime.combine(today, datetime.max.time()).astimezone(user_timezone)

    energy_events = EnergyEvent.objects.filter(user=user, started_at__range=(week_start_dt, today_end_dt)).order_by(
        "started_at"
    )

    events_by_date = defaultdict(list)
    for e in energy_events:
        local_date = e.started_at.astimezone(user_timezone).date()
        events_by_date[local_date].append(e)

    output = []
    for i in range(7):
        day = week_start + timedelta(days=i)
        day_events = events_by_date.get(day, [])
        if day_events:
            last_event = day_events[-1]
            energy = last_event.energy_after
        else:
            energy = None
        output.append({"date": day.isoformat(), "energy": energy})

    return {"energy_overview": output}
