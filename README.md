# Energy Tracker

Full-stack application for tracking user energy levels based on daily activities.

The project helps users understand how different activities affect their energy,
provides statistics, and generates personalized recommendations.

## Features

- User registration and authentication (JWT)
- Energy events tracking (load & recovery)
- Personal energy dashboard
- Weekly statistics and activity summaries
- REST API with Swagger (OpenAPI) documentation

## Tech Stack

### Backend

- Python
- Django
- Django REST Framework
- PostgreSQL
- JWT Authentication (SimpleJWT)
- drf-spectacular (Swagger / OpenAPI)

### Frontend

- React Native _(in progress)_

## Project Structure

```
.
├── backend
│   ├── apps
│   │   ├── common
│   │   │   └── migrations
│   │   ├── energy
│   │   │   ├── domain
│   │   │   ├── migrations
│   │   │   ├── services
│   │   │   │   └── statistics
│   │   │   └── tests
│   │   └── users
│   │       ├── migrations
│   │       ├── services
│   │       └── tests
│   └── config
│       ├── logs
│       └── settings
└── frontend(coming soon)
```

## Getting Started (Backend)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/energy-tracker.git
cd energy-tracker
```

### 2. Create virtual environment

```bash
python -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r backend/requirements.txt
```

### 4. Set up PostgreSQL

Make sure PostgreSQL is running and the database exists:

```sql
CREATE DATABASE energy_tracker;

```

### 5. Run migrations

```bash
python backend/manage.py makemigration
python backend/manage.py migrate
```

### 7. Start development server

```bash
python backend/manage.py runserver
```

---

## API Documentation (Swagger)

Swagger UI is available at:

```
http://localhost:8000/api/docs/
```

OpenAPI schema:

```
http://localhost:8000/api/schema/
```

All endpoints are documented with request/response schemas.

---

## Authentication

The API uses JWT authentication.

For protected endpoints, include the header:

```
Authorization: Bearer <access_token>
```

---

## Documentation

Detailed documentation is located in the `documentation/` directory:

- `documentation.md` — general project overview
- `backend.md` — backend architecture and API details
- `frontend.md` — frontend documentation _(coming soon)_
