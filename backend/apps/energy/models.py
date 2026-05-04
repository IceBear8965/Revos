from django.conf import settings
from django.contrib.postgres.constraints import ExclusionConstraint
from django.contrib.postgres.fields import RangeOperators
from django.db import models
from django.db.models import CheckConstraint, F, Q

from .enums import EventTypeChoices

User = settings.AUTH_USER_MODEL


class ModelParams(models.Model):
    params_json = models.JSONField()
    version = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)


class ActivityType(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="activity_types")

    category = models.CharField(max_length=10, choices=EventTypeChoices.choices)
    name = models.CharField(max_length=32)
    value = models.FloatField(default=1.0)

    is_custom = models.BooleanField(default=False)
    is_editable = models.BooleanField(default=True)

    class Meta:
        unique_together = ("user", "name")
        ordering = ["category", "name"]

    def __str__(self):
        return f"{self.name} ({self.category}) - ({self.id})"


class EnergyEvent(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="energy_events")

    activity = models.ForeignKey(ActivityType, on_delete=models.SET_NULL, null=True, blank=True)
    activity_category = models.CharField(
        max_length=10,
        choices=EventTypeChoices.choices,
    )
    activity_name = models.CharField(max_length=32)
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

    sleep_minutes = models.IntegerField(default=0)
    break_minutes = models.IntegerField(default=0)
    continuous_load_minutes = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.activity_name} : {self.started_at} — {self.ended_at} ({self.id})"

    class Meta:
        ordering = ["-started_at"]
        indexes = [
            models.Index(fields=["user", "started_at"]),
        ]
        constraints = [
            CheckConstraint(
                condition=Q(started_at__lt=F("ended_at")),
                name="event_start_before_end",
            ),
            ExclusionConstraint(
                name="prevent_event_overlap",
                expressions=[
                    (
                        models.Func(
                            F("started_at"),
                            F("ended_at"),
                            function="tstzrange",
                        ),
                        RangeOperators.OVERLAPS,
                    ),
                    ("user", RangeOperators.EQUAL),
                ],
            ),
        ]
