from django.db import models


class EventTypeChoices(models.TextChoices):
    LOAD = "load", "Load"
    RECOVERY = "recovery", "Recovery"
    SYSTEM = "system", "System"
