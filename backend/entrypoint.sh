#!/bin/sh
set -e

echo "DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE"

echo "Waiting for postgres..."

DB_HOST=$(python -c "from urllib.parse import urlparse; import os; print(urlparse(os.environ['DATABASE_URL']).hostname)")
DB_PORT=$(python -c "from urllib.parse import urlparse; import os; print(urlparse(os.environ['DATABASE_URL']).port)")

while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done

echo "PostgreSQL started"

echo "Running migrations..."
python manage.py migrate --noinput

echo "Creating superuser (if needed)..."
python manage.py create_admin

echo "Collecting static..."
python manage.py collectstatic --noinput

echo "Starting server..."
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:${PORT:-8000}
