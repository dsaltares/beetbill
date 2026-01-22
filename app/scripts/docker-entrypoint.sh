#!/bin/sh

# Docker entrypoint script for the invoicing app
# Handles database migrations and starts the Next.js application

set -e

echo "🚀 Starting invoicing application..."

# Check if we should run migrations
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "📦 Running database migrations..."
  
  # Wait for database to be ready
  echo "⏳ Waiting for database to be ready..."
  while ! npx prisma db push --accept-data-loss --schema=./prisma/schema.prisma 2>/dev/null; do
    echo "Database not ready, waiting 2 seconds..."
    sleep 2
  done
  
  echo "✅ Database is ready"
  
  # Run migrations
  npx prisma migrate deploy
  
  echo "✅ Migrations completed"
else
  echo "ℹ️  Skipping migrations (RUN_MIGRATIONS not set to 'true')"
fi

# Start the application
echo "🌟 Starting Next.js application..."
exec "$@"
