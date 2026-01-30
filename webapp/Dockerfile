# Stage 1: Build
FROM node:20 AS builder

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/
RUN pnpm install --frozen-lockfile

COPY . .

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Install postgresql-client to use pg_isready
RUN apk add --no-cache postgresql-client

RUN corepack enable

COPY --from=builder /app .

# Copy your start script and make executable
COPY start.sh .
RUN chmod +x start.sh

EXPOSE 3000
