from django.contrib import admin

from .models import ActivityType, EnergyEvent

# Register your models here.
admin.site.register(EnergyEvent)
admin.site.register(ActivityType)
