from datetime import datetime, timedelta

import pytz


def get_week_period(user):
    user_timezone = pytz.timezone(user.timezone)

    today = datetime.now(user_timezone).date()
    week_start = today - timedelta(days=6)

    week_start_local = user_timezone.localize(datetime.combine(week_start, datetime.min.time()))

    today_local = user_timezone.localize(datetime.combine(today, datetime.max.time()))

    return {
        "tz": user_timezone,
        "week_start": week_start,
        "week_start_local": week_start_local,
        "today_local": today_local,
        "week_start_utc": week_start_local.astimezone(pytz.UTC),
        "today_utc": today_local.astimezone(pytz.UTC),
    }
