# everything phony
.PHONY: $(shell grep --no-filename -E '^([a-zA-Z_-]|/)+:' $(MAKEFILE_LIST) | sed 's/:.*//')

docker/up:
	docker compose up -d
	docker compose run --rm dockerize -wait tcp://redis:6379 -wait tcp://postgres:5432

docker/down:
	docker compose down

docker/clean:
	docker compose down -v --remove-orphans
	docker compose rm -f -s -v

redis/reset: redis/reset/dev redis/reset/test

redis/reset/dev:
	docker compose exec redis redis-cli -n 0 FLUSHDB

redis/reset/test:
	docker compose exec redis redis-cli -n 1 FLUSHDB

db/reset: db/reset/dev db/reset/test

db/reset/dev:
	docker compose exec -T postgres psql postgres postgres -c 'DROP DATABASE IF EXISTS "development"' -c 'CREATE DATABASE "development"'

db/reset/test:
	docker compose exec -T postgres psql postgres postgres -c 'DROP DATABASE IF EXISTS "test"' -c 'CREATE DATABASE "test"'

db/console/dev:
	docker compose exec postgres psql postgres -d development

test/setup: redis/reset/test
