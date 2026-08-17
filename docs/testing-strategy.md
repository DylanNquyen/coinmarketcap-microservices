# Testing Strategy

## Goals

- Protect authentication, authorization, watchlist ownership, and upstream-data normalization.
- Detect breaking API contract and frontend integration changes before release.
- Keep tests deterministic by replacing external providers with controlled fakes.

## Current baseline

Each NestJS service contains the starter Jest unit and end-to-end setup. The frontend has lint and production-build commands but no automated component or end-to-end test framework. Existing starter tests must be reviewed before they are treated as meaningful feature coverage.

## Test layers

### Static checks

- Run ESLint for all three applications.
- Run the TypeScript/Vite production build for the frontend.
- Run NestJS builds for both backend services.

### Unit tests

Prioritize:

- Password hashing and invalid-credential behavior
- JWT issue and verification behavior
- Coin response normalization and network mapping
- Watchlist normalization, duplicates, missing items, and user scoping
- Market overview cache, partial upstream failure, and stale responses
- AI service error handling
- Zustand state transitions and data formatters

Mock TypeORM repositories, time, HTTP clients, and Gemini at this layer.

### Integration tests

- Test repositories against disposable MySQL databases.
- Test controllers and guards through NestJS application instances.
- Verify that user A cannot read or delete user B's watchlist records.
- Verify Kong route prefixes against the two running services.

### End-to-end tests

Cover the critical user journeys:

1. Register, log in, and restore the authenticated session.
2. Load market data and receive a Socket.IO update.
3. Add, view, and remove a watchlist item.
4. Handle expired or invalid authentication.
5. Submit an AI prompt and handle provider failure safely.

Use mocked upstream providers in CI. A separate optional smoke suite may call real providers with strict quotas.

## Local commands

```powershell
npm --prefix frontend run lint
npm --prefix frontend run build
npm --prefix backend run lint
npm --prefix backend run test
npm --prefix backend run test:e2e
npm --prefix auth-ms run lint
npm --prefix auth-ms run test
npm --prefix auth-ms run test:e2e
```

The NestJS lint scripts include `--fix`; they can modify source files. Use `npx eslint` without `--fix` when a read-only lint report is required.

## Test data rules

- Never use production credentials or copied production user data.
- Generate unique email addresses per test.
- Reset disposable databases between suites.
- Freeze time for cache and JWT expiry tests.
- Assert public contracts rather than private implementation details.

## Definition of done

A change is ready when relevant static checks pass, new behavior has focused automated coverage, security-sensitive paths include negative tests, and documentation reflects any API or environment changes.
