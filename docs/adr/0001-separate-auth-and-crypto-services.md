# ADR 0001: Separate authentication and crypto services behind Kong

- Status: Accepted
- Date: 2026-07-27

## Context

Authentication data and cryptocurrency features have different responsibilities and security concerns. The frontend also benefits from a single HTTP entry point rather than knowing every internal service address.

## Decision

Run authentication and crypto capabilities as separate NestJS services with separate MySQL databases. Route their HTTP APIs through Kong using `/api/auth`, `/api/crypto`, and `/api/ai` prefixes. Keep Socket.IO connected directly to the crypto service during local development.

## Consequences

- Each service owns its schema and can evolve independently.
- Authentication failures and crypto-provider failures are isolated at the process level.
- Kong provides one HTTP base URL for the frontend.
- Local development requires more processes and infrastructure.
- Both services must agree on JWT signing and claim semantics.
- Watchlist ownership uses the JWT subject without a cross-database foreign key.
- WebSocket deployment needs a separate edge-routing decision.

## Alternatives considered

- A single NestJS monolith: simpler to run, but couples authentication and market concerns.
- Direct frontend calls to both services: avoids Kong, but exposes internal topology and duplicates edge configuration.
