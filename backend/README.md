# Yoga Reservation Backend

FastAPI backend for the yoga class reservation system.

## Requirements

- Python 3.11+
- PostgreSQL 15+

## Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE yoga_reserve;
```

2. Create a virtual environment and install dependencies:
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
```

3. Configure environment variables:
Copy `.env` and update the values:
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Generate a secure random key for JWT tokens
- `CORS_ORIGINS`: Frontend URL (default: http://localhost:3000)

4. Run database migrations:
```bash
alembic upgrade head
```

5. Start the development server:
```bash
uvicorn app.main:app --host localhost --port 3001 --reload
```

The API will be available at http://localhost:3001

## API Documentation

Once the server is running, you can access:
- Interactive API docs (Swagger UI): http://localhost:3001/docs
- Alternative API docs (ReDoc): http://localhost:3001/redoc

## Database Schema

The application uses the `yoga_reserve` schema with the following tables:

- `users`: User accounts with authentication
- `services`: Yoga class services
- `slots`: Available time slots for services
- `bookings`: User bookings with status tracking

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:
- Access tokens expire in 30 minutes
- Refresh tokens expire in 7 days
- Include the access token in the `Authorization: Bearer <token>` header

## Development

To create a new migration after modifying models:
```bash
alembic revision --autogenerate -m "description of changes"
alembic upgrade head
```

## Testing

Run tests with pytest (to be configured):
```bash
pytest
```
