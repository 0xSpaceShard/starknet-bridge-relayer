include .env

dev-up: dev-down
	docker compose -f docker-compose-dev.yaml up

dev-down:
	docker compose -f docker-compose-dev.yaml down -v

dev-build: dev-down
	docker compose -f docker-compose-dev.yaml build

.PHONY: dev-up dev-down dev-build