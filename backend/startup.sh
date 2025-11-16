#!/bin/bash

# Azure Web Apps startup script for FastAPI application
# This script runs database migrations and starts the uvicorn server

echo "Starting application startup script..."

# Run database migrations
echo "Running database migrations..."
alembic upgrade head

# Check if sample data needs to be inserted
echo "Checking for sample data..."
python -c "
from app.db.database import SessionLocal
from app.models.models import Service

db = SessionLocal()
try:
    count = db.query(Service).count()
    if count == 0:
        print('No data found, inserting sample data...')
        import subprocess
        subprocess.run(['python', 'scripts/create_sample_data.py'])
    else:
        print(f'Found {count} services, skipping sample data insertion')
finally:
    db.close()
"

# Start the application
echo "Starting uvicorn server..."
uvicorn app.main:app --host 0.0.0.0 --port 8000
