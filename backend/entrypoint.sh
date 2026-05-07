#!/bin/sh

set -e

echo "Waiting for postgres..."

DB_HOST=$(python -c "from urllib.parse import urlparse; import os; print(urlparse(os.environ['DATABASE_URL']).hostname)")
DB_PORT=$(python -c "from urllib.parse import urlparse; import os; print(urlparse(os.environ['DATABASE_URL']).port)")

while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done

echo "PostgreSQL started"

python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:${PORT:-8000}
