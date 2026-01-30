## RADIO SHOW README

# Mugen Beat

An internet radio platform for live streaming, DJ scheduling, show archiving, and music community building.

## Features

- **Live Broadcasting** via Icecast & Liquidsoap
- **DJ Authentication & Scheduling**
- **Show Recording & Archiving**
- **Modern Web Frontend** with Next.js
- **PostgreSQL + Prisma** for relational data
- **Fully Containerized** with Docker Compose

## Tech Stack

- **Frontend:** Next.js, TailwindCSS, React, Typescript
- **Backend:** Next.js API Routes and Server Actions
- **Streaming:** Liquidsoap + Icecast
- **Database:** PostgreSQL (via Prisma ORM)
- **Storage:** S3 (for archived shows)
- **Deployment:** Docker Compose (Dev & Prod ready)

## Getting Started

### Prerequisites

- [Docker & Docker Compose](https://docs.docker.com/compose/install/)
- Node.js (for webapp dev / Prisma CLI)

### Development Setup

1. git clone https://github.com/squee72564/Radio-Show
2. cd Radio-Show
3. cp .env.dev.template .env.dev
4. Fill out env vars
5. make dev
6. cd webapp
7. npm install
8. npm run db:generate:dev
9. npm run db:migrate:dev
10. npm run dev

### Prod Setup

1. git clone https://github.com/squee72564/Radio-Show
2. cd Radio-Show
3. cp .env.prod.template .env.prod
4. Fill out env vars
5. make prod
6. cd webapp
7. npm install
8. npx dotenv -e ../.env.prod -- prisma generate
9. npx dotenv -e ../.env.prod -- prisma migrate deploy
10. npm run prod-run

### Useful Make Targets

- make dev (dev stack)
- make prod (prod stack)
- make test (postgres only)
- make build (build dev images)
- make rebuild (rebuild dev images without cache)
- make logs (tail dev logs)
- make ps (show dev stack)
- make down (stop dev stack)
- make down-all (stop dev + prod stacks)
- make clean (stop dev stack + remove dev volumes)
