# Tiny python image
FROM python:3.12-slim

# Libs to build postgres
RUN apt-get update && \
    apt-get install -y build-essential libpq-dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# === Work dir inside of container ===
WORKDIR /app

# Requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend from local machine into container
COPY . .
ENV DJANGO_SETTINGS_MODULE=config.settings.prod

# Print logs in console and not in file(to reduce space usage)
ENV PYTHONUNBUFFERED=1

# Run gunicorn
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8080"]
