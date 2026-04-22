from .base import *

DEBUG = True
ALLOWED_HOSTS = ["*"]

SECRET_KEY = "django-insecure-+b1#_t_d7jox+zx3rxl-m9-7gkx4a#*vo8trw%&l4ptaj_w6!1"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "revos_database",
        "USER": "revos_admin",
        "PASSWORD": "pyjmip-nekje9-wippeS",
        "HOST": "localhost",
        "PORT": "5432",
    }
}
