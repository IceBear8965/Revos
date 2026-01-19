from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL


class EnergyProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="energy_profile")

    current_energy = models.FloatField(default=1.0)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user} – {self.current_energy:.2f}"


LOAD = "load"
RECOVERY = "recovery"

EVENT_TYPE_CHOICES = [
    (LOAD, "Load"),
    (RECOVERY, "Recovery"),
]


class EnergyEvent(models.Model):
    LOAD = "load"
    RECOVERY = "recovery"

    EVENT_TYPE_CHOICES = [
        (LOAD, "Load"),
        (RECOVERY, "Recovery"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="energy_events")

    event_type = models.CharField(max_length=10, choices=EVENT_TYPE_CHOICES)

    activity_type = models.CharField(max_length=32)
    activity_coef = models.FloatField()
    subjective_coef = models.FloatField(default=1.0)

    started_at = models.DateTimeField()
    ended_at = models.DateTimeField()
    duration_sec = models.PositiveIntegerField()

    energy_before = models.FloatField()
    energy_delta = models.FloatField()
    energy_after = models.FloatField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-started_at"]


class ActivityType(models.Model):
    WORK = "work"
    STUDY = "study"
    SOCIETY = "society"
    SLEEP = "sleep"
    REST = "rest"
    SPORT = "sport"

    ACTIVITY_TYPE_CHOICES = [
        (WORK, "Work"),
        (STUDY, "Study"),
        (SOCIETY, "Society"),
        (SLEEP, "Sleep"),
        (REST, "Rest"),
        (SPORT, "Sport"),
    ]

    code = models.CharField(max_length=32, choices=ACTIVITY_TYPE_CHOICES, unique=True)
    category = models.CharField(max_length=10, choices=EVENT_TYPE_CHOICES)
    activity_coef = models.FloatField(default=1.0)

    def __str__(self):
        return f"{self.code} ({self.category})"
