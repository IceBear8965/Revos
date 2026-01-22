from django.contrib import admin

from .models import ActivityType, EnergyEvent, EnergyProfile, PersonalActivityProfile

# Register your models here.
admin.site.register(EnergyEvent)
admin.site.register(ActivityType)
admin.site.register(PersonalActivityProfile)
admin.site.register(EnergyProfile)
