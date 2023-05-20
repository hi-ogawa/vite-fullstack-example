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
