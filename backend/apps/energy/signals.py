from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import EnergyProfile, PersonalActivityProfile

User = settings.AUTH_USER_MODEL


@receiver(post_save, sender=User)
def create_energy_profile(sender, instance, created, **kwargs):
    if created:
        EnergyProfile.objects.create(user=instance)
        PersonalActivityProfile.objects.create(
            user=instance, load_order=["work", "study", "society"]
        )
