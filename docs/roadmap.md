# Roadmap

The roadmap separates documentation-only work from changes that affect runtime behavior or infrastructure. Runtime work should be delivered in small, independently tested pull requests.

## Completed documentation baseline

- Root project README and local setup guide
- Architecture and data-flow documentation
- Environment variable reference and safe example files
- Current API and WebSocket reference
- Testing strategy and threat model
- Architecture Decision Record directory

## Next: quality baseline

- Run read-only lint reports and classify each finding before making fixes.
- Replace generated starter tests with tests for current controllers and services.
- Add frontend component tests for authentication, watchlist, filters, and formatters.
- Add deterministic integration tests with mocked external APIs.

## Security hardening

- Move JWT and database configuration to validated environment variables.
- Add DTO validation and request payload limits.
- Restrict CORS by environment.
- Protect the AI endpoint with authentication, quotas, and rate limits.
- Define token rotation or refresh-token behavior before implementation.
- Remove public access to Kong Admin and database ports in deployed environments.

## Data and reliability

- Replace TypeORM `synchronize` with reviewed migrations outside local development.
- Define cache freshness and failure behavior for every upstream provider.
- Add structured logs, health endpoints, metrics, and trace correlation.
- Evaluate Redis, queues, and circuit breakers only after load and failure requirements are measured.

## Delivery and scalability

- Containerize application services after runtime configuration is externalized.
- Add CI for lint, build, tests, dependency review, and secret scanning.
- Route WebSocket traffic consistently through the production edge.
- Add bundle analysis and code splitting based on measured frontend performance.

## Release checkpoints

Each runtime milestone should preserve a working application, include rollback notes, update the relevant ADR/API documentation, and pass focused automated tests before the next milestone starts.
