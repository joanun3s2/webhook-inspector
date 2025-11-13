#!/usr/bin/env bash

echo "Starting setup..."

echo "Creating .env file..."
cp .env.example .env

if [ "$(docker ps -q -f name=my_api_container)" ]; then
  docker compose down
fi


echo "Creating database..."
docker compose up -d postgres

sleep 5

echo "Creating database tables..."
pnpm run db:generate

sleep 1

echo "Migrating database..."
pnpm run db:migrate

sleep 1

echo "Seeding database..."
pnpm run db:seed

echo "Starting server..."

pnpm run dev
