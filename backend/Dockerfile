FROM python:3.12-slim

# system deps (одним слоем)
RUN apt-get update && \
    apt-get install -y build-essential libpq-dev netcat-openbsd && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# dependencies first (cache layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# app code
COPY . .

ENV DJANGO_SETTINGS_MODULE=config.settings.prod
ENV PYTHONUNBUFFERED=1

# entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]
