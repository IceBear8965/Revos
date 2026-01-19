from datetime import datetime
from random import randint

import pytz

from ..models import EnergyEvent, EnergyProfile

# =========================
# Constants (bounded sets)
# =========================

ENERGY_LOW = "low"
ENERGY_BELOW = "below"
ENERGY_OK = "ok"
ENERGY_HIGH = "high"

CONTEXT_FIRST = "first_launch"
CONTEXT_AFTER_LOAD = "after_load"
CONTEXT_AFTER_RECOVERY = "after_recovery"


# =========================
# Messages & recommendations
# =========================

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
    ENERGY_OK: "You can continue your tasks",
    ENERGY_HIGH: "Great time for challenging tasks",
}


# =========================
# Greeting
# =========================


def generate_greeting(timezone, user):
    tz = pytz.timezone(timezone)
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

    return greetings[randint(0, len(greetings) - 1)]


# =========================
# Dashboard content logic
# =========================


def generate_dashboard_content(*, user, last_event):
    energy_profile = user.energy_profile
    current_energy = round(energy_profile.current_energy, 3)

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
    elif last_event.event_type == "load":
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


# =========================
# Public dashboard generator
# =========================


def generate_dashboard(*, user) -> dict:
    greeting = generate_greeting(user.timezone, user)

    energy_profile, _ = EnergyProfile.objects.get_or_create(user=user)
    current_energy = energy_profile.current_energy

    last_event_obj = EnergyEvent.objects.filter(user=user).order_by("-created_at").first()

    message, recommendation = generate_dashboard_content(
        user=user,
        last_event=last_event_obj,
    )

    last_event = None
    if last_event_obj:
        last_event = {
            "id": last_event_obj.id,
            "event_type": last_event_obj.event_type,
            "activity_type": last_event_obj.activity_type,
            "started_at": last_event_obj.started_at,
            "ended_at": last_event_obj.ended_at,
            "energy_delta": last_event_obj.energy_delta,
        }

    return {
        "greeting": greeting,
        "current_energy": current_energy,
        "message": message,
        "recommendation": recommendation,
        "last_event": last_event,
    }
