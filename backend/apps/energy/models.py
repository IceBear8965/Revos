from django.conf import settings
from django.db import models

from .constants import ACTIVITY_TYPE_CHOICES, EVENT_TYPE_CHOICES

User = settings.AUTH_USER_MODEL


class ModelParams(models.Model):
    params_json = models.JSONField()
    version = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)


class ActivityType(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="activity_types")

    category = models.CharField(max_length=10, choices=EVENT_TYPE_CHOICES)

    name = models.CharField(max_length=32)

    value = models.FloatField(default=1.0)

    is_custom = models.BooleanField(default=False)
    is_editable = models.BooleanField(default=True)

    class Meta:
        unique_together = ("user", "name")
        ordering = ["category", "name"]

    def __str__(self):
        return f"{self.name} ({self.category})"


class EnergyEvent(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="energy_events")

    event_type = models.CharField(max_length=10, choices=EVENT_TYPE_CHOICES)
    activity_type = models.CharField(max_length=32)

    activity_coef = models.FloatField()
    subjective_coef = models.FloatField()
    params_version = models.ForeignKey(ModelParams, on_delete=models.PROTECT)

    started_at = models.DateTimeField()
    ended_at = models.DateTimeField()

    energy_before = models.FloatField()
    energy_after = models.FloatField()

    acute_before = models.FloatField()
    acute_after = models.FloatField()

    chronic_before = models.FloatField()
    chronic_after = models.FloatField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.activity_type} : {self.started_at} — {self.ended_at} ({self.id})"

    class Meta:
        ordering = ["-started_at"]
        indexes = [
            models.Index(fields=["user", "started_at"]),
        ]
