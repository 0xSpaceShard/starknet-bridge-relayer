# Starknet Bridge Relayer

## Development

### Install
```sh
yarn
```

### Start development
#### Setup env
Duplicate the `example.env` file and rename it to `.env`

```sh
yarn start:dev
```

### Access swagger UI
```sh
http://0.0.0.0:3000/api
```

### Prometheus metrics
```sh
http://0.0.0.0:3000/metric
```

### Tests
#### Run unit tests
```sh
yarn test
```

#### Run e2e tests
1. Start the services
```sh
cd e2e && make e2e-up
```
2. Restore the database
```sh
cd e2e && make e2e-setup
```
3. Run tests
```sh
cd e2e && make e2e-test
```
