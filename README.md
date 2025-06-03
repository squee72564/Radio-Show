## RADIO SHOW README

# Docker Commands

- Dev

  1. docker-compose up --build
  2. npx primsa migrate dev --name init
  3. npm run dev

- Prod:
  1. docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
