from collections import defaultdict
from datetime import datetime, timedelta

import pytz

from ...models import EnergyEvent


def generate_activities_summary(*, user):
    user_timezone = pytz.timezone(user.timezone)
    today = datetime.now(user_timezone).date()
    week_start = today - timedelta(days=6)

    week_start_local = user_timezone.localize(datetime.combine(week_start, datetime.min.time()))
    today_local = user_timezone.localize(datetime.combine(today, datetime.max.time()))

    week_start_utc = week_start_local.astimezone(pytz.UTC)
    today_utc = today_local.astimezone(pytz.UTC)

    energy_events = EnergyEvent.objects.filter(
        user=user, started_at__range=(week_start_utc, today_utc)
    ).order_by("started_at")

    events_by_activity_type = defaultdict(list)
    for e in energy_events:
        activity_type = e.activity_type
        events_by_activity_type[activity_type].append(e)

    output = []
    for activity_type, events in events_by_activity_type.items():
        avg_energy_delta = sum(e.energy_delta for e in events) / len(events)
        event_count = len(events)

        output.append(
            {
                "activity_type": activity_type,
                "avg_energy_delta": avg_energy_delta,
                "event_count": event_count,
            }
        )
    return output
