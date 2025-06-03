#!/bin/sh

echo "Building nextjs app..."
npm run build

# Wait for Postgres to be ready (adjust env vars as needed)
until pg_isready -h ${POSTGRES_HOST:-postgres} -p ${POSTGRES_PORT:-5432} -U ${POSTGRES_USER:-user}; do
  echo "Waiting for Postgres at $POSTGRES_HOST:$POSTGRES_PORT..."
  sleep 2
done

echo "Postgres is ready."

echo "Running Prisma migrations and generate..."
npx prisma generate
npx prisma migrate deploy

echo "Starting app..."
npm run start
