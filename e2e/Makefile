include ./e2e.env

e2e-up: e2e-down
	docker compose -f docker-compose-e2e.yaml up -d

e2e-down:
	docker compose -f docker-compose-e2e.yaml down

e2e-build: e2e-down
	docker compose -f docker-compose-e2e.yaml build

e2e-test:
	export TRUSTED_MODE=false
	cd .. && yarn test:e2e --runInBand

e2e-setup:
# restore mongo data
	docker cp data/dump e2e-mongo-1:/dump && \
	docker exec e2e-mongo-1 /bin/bash -c mongorestore --db=starknet_bridge_indexer /dump/starknet_bridge_indexer -v \

.PHONY: e2e-up e2e-down e2e-build e2e-test e2e-setup

# db.withdraw.updateMany({},{$push: { "transfers": {"from_": HexData(0, "0000000000000000000000000000000000000000000000000000000000000002"), "to": HexData(0, "0000000000000000000000000000000000000000000000000000000000000001"), "value": Binary((Math.ceil(Math.random() * 1000).toString()))}}})