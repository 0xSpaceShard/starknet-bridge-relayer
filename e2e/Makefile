include ./e2e.env

e2e-up: e2e-down
	docker compose -f docker-compose-e2e.yaml up -d

e2e-down:
	docker compose -f docker-compose-e2e.yaml down

e2e-build: e2e-down
	docker compose -f docker-compose-e2e.yaml build

e2e-test:
	docker exec e2e-relayer-test-1 yarn test:e2e --runInBand

e2e-setup:
# restore mongo data
	docker cp data/dump e2e-mongo-1:/dump && \
	docker exec e2e-mongo-1 /bin/bash -c mongorestore --db=starknet_bridge_indexer /dump/starknet_bridge_indexer -v \

.PHONY: e2e-up e2e-down e2e-build e2e-test e2e-setup
