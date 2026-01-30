.PHONY: help dev prod test down down-all ps logs build rebuild clean

COMPOSE = docker compose
BASE = -f docker-compose.yml
DEV = $(BASE) -f docker-compose.override.yml
PROD = $(BASE) -f docker-compose.prod.yml
TEST = -f docker-compose.test.yml

help:
	@printf "%s\n" \
	"Targets:" \
	"  dev       Start dev stack (base + override)" \
	"  prod      Start prod stack (base + prod)" \
	"  test      Start test stack (postgres only)" \
	"  down      Stop dev stack" \
	"  down-all  Stop dev and prod stacks" \
	"  ps        Show running containers (dev stack)" \
	"  logs      Tail dev logs" \
	"  build     Build dev images" \
	"  rebuild   Rebuild dev images without cache" \
	"  clean     Stop dev stack and remove dev volumes"

dev:
	$(COMPOSE) $(DEV) up -d

prod:
	$(COMPOSE) $(PROD) up -d

test:
	$(COMPOSE) $(TEST) up -d

down:
	$(COMPOSE) $(DEV) down

down-all:
	$(COMPOSE) $(DEV) down
	$(COMPOSE) $(PROD) down

ps:
	$(COMPOSE) $(DEV) ps

logs:
	$(COMPOSE) $(DEV) logs -f

build:
	$(COMPOSE) $(DEV) build

rebuild:
	$(COMPOSE) $(DEV) build --no-cache

clean:
	$(COMPOSE) $(DEV) down -v
