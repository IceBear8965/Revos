import pytz
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)

    nickname = models.CharField(max_length=32)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    timezone = models.CharField(
        max_length=32,
        default="UTC",
        choices=[(tz, tz) for tz in pytz.all_timezones],
        blank=False,
    )

    USERNAME_FIELD = "email"
    objects = UserManager()

    def __str__(self):
        return self.nickname or self.email
