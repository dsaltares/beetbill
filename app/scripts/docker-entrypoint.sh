#!/bin/sh

# Docker entrypoint script for the invoicing app
# Handles database migrations and starts the Next.js application

set -e

echo "🚀 Starting invoicing application..."

# Check if we should run migrations
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "📦 Running database migrations..."
  
  # Wait for database to be ready using pg_isready-style check via Prisma
  echo "⏳ Waiting for database to be ready..."
  MAX_RETRIES=30
  RETRY_COUNT=0
  
  while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    # Try to connect to database with a simple query
    if echo "SELECT 1" | npx prisma db execute --stdin > /dev/null 2>&1; then
      echo "✅ Database connection established"
      break
    fi
    
    echo "Database not ready, waiting 2 seconds... (attempt $((RETRY_COUNT + 1))/$MAX_RETRIES)"
    sleep 2
    RETRY_COUNT=$((RETRY_COUNT + 1))
  done
  
  if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "❌ Could not connect to database after $MAX_RETRIES attempts"
    exit 1
  fi
  
  # Run migrations
  echo "🔄 Applying database migrations..."
  npx prisma migrate deploy
  
  echo "✅ Migrations completed"
else
  echo "ℹ️  Skipping migrations (RUN_MIGRATIONS not set to 'true')"
fi

# Start the application
echo "🌟 Starting Next.js application..."
exec "$@"
