import os

import dj_database_url

from .base import *

DEBUG = os.environ.get("DEBUG", "False").lower() == "true"

SECRET_KEY = os.environ.get("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY must be set in environment!")

DATABASES = {
    "default": dj_database_url.config(
        default=os.environ.get("DATABASE_URL"),
        conn_max_age=60,
    )
}

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]
# ALLOWED_HOSTS = [
#     host.strip() for host in os.environ.get("ALLOWED_HOSTS", "").split(",") if host.strip()
# ]
CSRF_TRUSTED_ORIGINS = [
    f"https://{host}" for host in os.environ.get("ALLOWED_HOSTS", "").split(",") if host
]

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True

SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
SECURE_REFERRER_POLICY = "same-origin"

# SECURE_SSL_REDIRECT = os.environ.get("SECURE_SSL_REDIRECT", "True") == "True"
# SESSION_COOKIE_SECURE = True
# CSRF_COOKIE_SECURE = True

# Local test values
SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False
