import random
from datetime import datetime

import pytz

from apps.energy.domain.errors import LastEventNotFound

from ..models import EnergyEvent
from ..utils.energy_delta import energy_delta

ENERGY_LOW = "low"
ENERGY_BELOW = "below"
ENERGY_OK = "ok"
ENERGY_HIGH = "high"

CONTEXT_FIRST = "first_launch"
CONTEXT_AFTER_LOAD = "after_load"
CONTEXT_AFTER_RECOVERY = "after_recovery"


# Messages & recommendations
MESSAGES = {
    ENERGY_LOW: {
        CONTEXT_FIRST: {
            "title": "Low energy",
            "content": "Your current energy level is quite low",
        },
        CONTEXT_AFTER_LOAD: {
            "title": "Overloaded",
            "content": "You’ve been under heavy load recently",
        },
        CONTEXT_AFTER_RECOVERY: {
            "title": "Still tired",
            "content": "Even after rest, your energy is still low",
        },
    },
    ENERGY_BELOW: {
        CONTEXT_FIRST: {
            "title": "Feeling tired",
            "content": "Your energy is slightly below average",
        },
        CONTEXT_AFTER_LOAD: {
            "title": "A bit tired",
            "content": "Recent activity drained some of your energy",
        },
        CONTEXT_AFTER_RECOVERY: {
            "title": "Recovering",
            "content": "You’re slowly regaining energy",
        },
    },
    ENERGY_OK: {
        CONTEXT_FIRST: {
            "title": "Stable energy",
            "content": "Your energy level is in a comfortable range",
        },
        CONTEXT_AFTER_LOAD: {
            "title": "Work accounted for",
            "content": "Your energy decreased, but you’re still okay",
        },
        CONTEXT_AFTER_RECOVERY: {
            "title": "Good recovery",
            "content": "Rest helped you regain energy",
        },
    },
    ENERGY_HIGH: {
        CONTEXT_FIRST: {
            "title": "Excellent energy",
            "content": "Your energy level is very high",
        },
        CONTEXT_AFTER_LOAD: {
            "title": "Still energetic",
            "content": "You still have plenty of energy left",
        },
        CONTEXT_AFTER_RECOVERY: {
            "title": "Fully charged",
            "content": "You’ve recovered well and are ready for more",
        },
    },
}

RECOMMENDATIONS = {
    ENERGY_LOW: "Start with some rest",
    ENERGY_BELOW: "Consider a short pause",
    ENERGY_HIGH: "Great time for challenging tasks",
    ENERGY_OK: "You can continue your tasks",
}


# Greeting
def generate_greeting(user):
    tz = pytz.timezone(user.timezone)
    hour = datetime.now(tz).hour
    name = user.nickname or "there"

    if 5 <= hour < 12:
        base = f"Good Morning, {name}!"
    elif 12 <= hour < 18:
        base = f"Good Afternoon, {name}!"
    else:
        base = f"Good Evening, {name}!"

    greetings = [
        base,
        f"Hello, {name}!",
        f"Hi, {name}!",
    ]

    return random.choice(greetings)


# Dashboard content
def generate_dashboard_content(*, last_event: EnergyEvent):
    current_energy = round(last_event.energy_after, 3)

    # --- energy state ---
    if current_energy < 0.25:
        state = ENERGY_LOW
    elif 0.25 <= current_energy < 0.5:
        state = ENERGY_BELOW
    elif 0.5 <= current_energy < 0.75:
        state = ENERGY_OK
    else:
        state = ENERGY_HIGH

    # --- context ---
    if last_event is None:
        context = CONTEXT_FIRST
    elif last_event.activity_category == "load":
        context = CONTEXT_AFTER_LOAD
    else:
        context = CONTEXT_AFTER_RECOVERY

    # --- safe defaults ---
    message = {
        "title": "Energy tracking",
        "content": "We are tracking your current energy level",
    }
    recommendation = "Keep tracking your activities"

    # --- table lookup ---
    state_messages = MESSAGES.get(state)
    if state_messages:
        message = state_messages.get(context, message)

    recommendation = RECOMMENDATIONS.get(state, recommendation)

    return message, recommendation


# Dashboard generator
def generate_dashboard(*, user) -> dict:
    greeting = generate_greeting(user)

    last_event = EnergyEvent.objects.filter(user=user).order_by("-started_at").first()
    if not last_event:
        raise LastEventNotFound()

    message, recommendation = generate_dashboard_content(last_event=last_event)

    if last_event.activity:
        activity_id = last_event.activity.id
    else:
        activity_id = None
    last_event_response = {
        "id": last_event.id,
        "activity": {
            "id": activity_id,
            "category": last_event.activity_category,
            "name": last_event.activity_name,
        },
        "started_at": last_event.started_at,
        "ended_at": last_event.ended_at,
        "energy_delta": energy_delta(last_event),
        "subjective_coef": last_event.subjective_coef,
    }

    return {
        "greeting": greeting,
        "current_energy": round(last_event.energy_after, 4),
        "message": message,
        "recommendation": recommendation,
        "last_event": last_event_response,
    }
