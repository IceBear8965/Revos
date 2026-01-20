from datetime import datetime


def generate_activities_summary(*, user):
    return {
        "activities_summary": [
            {"activity_type": "work", "total_energy_delta": -0.62, "event_count": 5},
            {"activity_type": "study", "total_energy_delta": -0.25, "event_count": 3},
            {"activity_type": "sleep", "total_energy_delta": 0.48, "event_count": 4},
            {"activity_type": "rest", "total_energy_delta": 0.20, "event_count": 2},
            {"activity_type": "sport", "total_energy_delta": 0.12, "event_count": 1},
        ]
    }
