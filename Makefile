# everything phony
.PHONY: $(shell grep --no-filename -E '^([a-zA-Z_-]|/)+:' $(MAKEFILE_LIST) | sed 's/:.*//')

docker/up:
	docker compose up -d
	docker compose run --rm dockerize -wait tcp://redis:6379

docker/down:
	docker compose down

docker/clean:
	docker compose down -v --remove-orphans
	docker compose rm -f -s -v

redis/reset: redis/reset/dev redis/reset/test

redis/reset/dev:
	docker compose exec redis redis-cli -u redis://localhost:6379/0 FLUSHDB

redis/reset/test:
	docker compose exec redis redis-cli -u redis://localhost:6379/1 FLUSHDB

test/setup: redis/reset/test
