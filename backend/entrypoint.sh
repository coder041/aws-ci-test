#!/bin/sh
set -e
# Run migrations (uses DATABASE_URL from env, set by ECS from Secrets Manager or .env locally)
alembic upgrade head
exec uvicorn main:app --host 0.0.0.0 --port 8000
