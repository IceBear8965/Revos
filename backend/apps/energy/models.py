from django.conf import settings
from django.db import models

from .constants import ACTIVITY_TYPE_CHOICES, EVENT_TYPE_CHOICES

User = settings.AUTH_USER_MODEL


class EnergyProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="energy_profile")

    current_energy = models.FloatField(default=1.0)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user} – {self.current_energy:.2f}"


class EnergyEvent(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="energy_events")

    event_type = models.CharField(max_length=10, choices=EVENT_TYPE_CHOICES)
    activity_type = models.CharField(max_length=32)

    base_coef = models.FloatField()
    activity_coef = models.FloatField()
    personal_coef = models.FloatField()
    subjective_coef = models.FloatField()

    started_at = models.DateTimeField()
    ended_at = models.DateTimeField()
    duration_sec = models.PositiveIntegerField()

    energy_before = models.FloatField()
    energy_delta = models.FloatField()
    energy_after = models.FloatField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.activity_type} : {self.started_at} — {self.ended_at} ({self.id})"

    class Meta:
        ordering = ["-started_at"]


class ActivityType(models.Model):
    code = models.CharField(max_length=32, choices=ACTIVITY_TYPE_CHOICES, unique=True)
    category = models.CharField(max_length=10, choices=EVENT_TYPE_CHOICES)
    activity_coef = models.FloatField(default=1.0)

    def __str__(self):
        return f"{self.code} ({self.category})"


class PersonalActivityProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="personal_activity_profile"
    )

    load_order = models.JSONField(default=list)

    def __str__(self):
        return f"{self.user.email} personal activity profile"
