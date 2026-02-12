import os

import dj_database_url

from .base import *

DEBUG = os.environ.get("DEBUG", "False") == "True"

SECRET_KEY = os.environ.get("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY must be set in environment!")

DATABASES = {"default": dj_database_url.config(default=os.environ.get("DATABASE_URL"))}

ALLOWED_HOSTS = ["*"]
