# Backend at the high level

Backend is being written in python using python django+django-rest-framework.

## Tech stack

- Python
- Django
- Django REST Framework
- PostgreSQL
- JWT Authentication (SimpleJWT)

## Backend file structure

```
.
├── apps
│   ├── common —> common for both apps
│   │   └── migrations
│   ├── energy —> responsible for domain logic
│   │   ├── domain
│   │   ├── migrations
│   │   ├── services
│   │   │   └── statistics
│   │   └── tests
│   └── users —> responsible for users
│       ├── migrations
│       ├── services
│       └── tests
└── config —> django project
    ├── logs
    └── settings —> setting presets for dev and prod
```

## Getting started

### Pre-requirements

- python 3.12.9
- postgresql@15

## Running app locally

1. ### Clone the repository
    ```
    git clone https://github.com/IceBear8965/Revos.git
    cd Revos
    ```
2. ### Create Postgre database

    ```s
    CREATE DATABASE energy_tracker;
    CREATE USER energy_user WITH PASSWORD 'password';
    ALTER ROLE energy_user SET client_encoding TO 'utf8';
    ALTER ROLE energy_user SET default_transaction_isolation TO 'read committed';
    ALTER ROLE energy_user SET timezone TO 'UTC';
    ALTER DATABASE energy_tracker OWNER TO energy_user;
    GRANT ALL ON SCHEMA public TO energy_user;
    ALTER SCHEMA public OWNER TO energy_user;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO energy_user;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO energy_user;
    GRANT ALL PRIVILEGES ON DATABASE energy_tracker TO energy_user;
    \q
    ```

3. ### Create virtual environment

    ```
    python -m venv venv
    source venv/bin/activate
    ```

4. ### Install python dependencies

    ```
    pip install -r backend/requirements.txt
    ```

5. ### Set django settings to dev

    ```
    export DJANGO_SETTINGS_MODULE=config.settings.dev
    ```

6. ### Run migrations

    ```
    python manage.py makemigrations
    python manage.py migrate
    ```

7. ### Start development server
    ```
    python manage.py runserver
    ```

## Api documentation

Swagger UI is available at:

```
http://127.0.0.1:8000/api/docs/
```

OpenAPI schema:

```
http://127.0.0.1:8000/api/schema/
```

All endpoints are documented with request/response schemas.

## Authentication

The API uses JWT authentication.

For protected endpoints, include the header:

```
Authorization: Bearer <access_token>
```

## Deploying app

This example uses Supabase as remote database

1. ### Create ActivityType dump

    ```
    python manage.py dumpdata energy.ActivityType --indent 4 > activity_type.json
    ```

2. ### Set env variables

    ```
    export DEBUG=False
    export SECRET_KEY="YOUR-DJANGO-SECRET"
    export DATABASE_URL="YOUR-DATABASE-URL" (on supabase you should use "Transaction Puller" option)
    ```

3. ### Set django settings to prod

    ```
    export DJANGO_SETTINGS_MODULE=config.settings.prod
    ```

    Now Django can connect to remote database

4. ### Make migrations into remote database

    ```
    python manage.py showmigrations —> check that everything is okay
    python manage.py makemigrations
    python manage.py migrate
    ```

5. ### Import ActivityTypes into remote database

    ```
    python manage.py loaddata activity_type.json
    ```

6. ### Build docker container

    ```
    docker build -t revos:backend .
    ```

7. ### Run docker container

    ```
    docker run -it \
    -e DJANGO_SETTINGS_MODULE=config.settings.prod \
    -e DEBUG=False \
    -e SECRET_KEY='YOUR-DJANGO-SECRET' \
    -e DATABASE_URL='REMOTE-DATABASE-URL' \
    -p 8080:8080 \
    revos:backend

    ```

    Alternatively, you can create a .env file and pass it via --env-file .env

8. ### Test docker

    ```
    Open http://127.0.0.1:8080/admin in browser. You should see django admin page(without styling)
    ```
