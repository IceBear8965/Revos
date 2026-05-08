import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Creates initial superuser if it does not exist"

    def handle(self, *args, **kwargs):
        User = get_user_model()

        email = os.environ.get("DJANGO_ADMIN_EMAIL")
        password = os.environ.get("DJANGO_ADMIN_PASSWORD")

        if not email or not password:
            self.stdout.write(
                self.style.WARNING("Admin credentials not set, skipping superuser creation")
            )
            return

        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.SUCCESS("Superuser already exists"))
            return

        User.objects.create_superuser(
            email=email,
            password=password,
        )

        self.stdout.write(self.style.SUCCESS("Superuser created"))
