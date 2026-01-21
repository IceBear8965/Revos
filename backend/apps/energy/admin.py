from django.contrib import admin

from .models import ActivityType, EnergyEvent, PersonalActivityProfile

# Register your models here.
admin.site.register(EnergyEvent)
admin.site.register(ActivityType)
admin.site.register(PersonalActivityProfile)
