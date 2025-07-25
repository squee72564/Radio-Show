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
- Node.js (for frontend dev)

### Development Setup

1. git clone https://github.com/squee72564/Radio-Show
2. cd Radio-Show
3. cp .env.dev.template .env.dev
4. Fill out env vars
5. docker compose up --build
6. npx primsa migrate dev --name init
7. npm run dev

### Prod Setup

1. git clone https://github.com/squee72564/Radio-Show
2. cd Radio-Show
3. cp .env.prod.template .env.prod
4. Fill out env vars
5. docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
6. npm run prod-run
