# Threat Model

## Scope

This document covers the browser frontend, Kong Gateway, authentication service, crypto service, local databases, and external market/AI providers. It describes the current implementation and recommended controls; it does not claim that all controls are implemented.

## Assets

- User email addresses and password hashes
- JWT access tokens and signing secret
- Gemini API key
- User watchlists
- Database and Kong administration credentials
- Availability and integrity of displayed market data

## Trust boundaries

1. Browser to Kong over HTTP in local development
2. Browser directly to the Socket.IO service
3. Kong to internal NestJS services
4. Services to MySQL databases
5. Crypto service to CoinGecko, CoinMarketCap, and Gemini
6. Developer workstation to the exposed Kong Admin API

## Key threats and current status

| Threat | Current exposure | Recommended control |
| --- | --- | --- |
| Credential stuffing and brute force | Login has no rate limit | Add gateway and account-aware rate limits, monitoring, and generic errors |
| JWT forgery | Signing secret is hard-coded | Inject a strong secret, rotate it, and centralize verification rules |
| Token theft | Token is stored in local storage | Apply strict CSP/XSS controls; evaluate secure HttpOnly cookies |
| Cross-origin abuse | Auth and WebSocket CORS are permissive | Allowlist trusted production origins |
| AI cost abuse | AI endpoint is public and unthrottled | Require authentication, quotas, input limits, and rate limiting |
| Prompt injection | User text reaches an external model | Treat output as untrusted, constrain prompts, and avoid privileged tools |
| Sensitive data disclosure | Prompts may contain private data | Publish usage guidance and redact/log minimally |
| Database exposure | Local database ports and credentials are published | Use private networking and secret injection outside development |
| Kong takeover | Admin API is exposed on `8001` | Bind privately, authenticate with RBAC, and never publish it |
| Schema loss or drift | TypeORM `synchronize` is enabled | Disable it outside local development and use reviewed migrations |
| Upstream manipulation/outage | Market data depends on third parties | Validate shapes, retain bounded caches, show stale state, and monitor failures |
| Resource exhaustion | Public endpoints and Socket.IO lack app-level limits | Add payload limits, timeouts, connection limits, and rate controls |

## Existing controls

- Passwords are hashed with bcrypt using cost factor 10.
- Watchlist endpoints require a JWT guard and scope queries by the token subject.
- Duplicate watchlist entries are prevented at both service and database levels.
- External HTTP requests have timeouts.
- Market overview requests use a bounded in-memory cache and partial-failure fallback.
- Overlapping WebSocket refreshes are prevented.
- Real `.env` files are ignored by Git.

## Security verification checklist

- Confirm no real secret is tracked in Git or included in frontend bundles.
- Test missing, malformed, expired, and forged JWTs.
- Test cross-user watchlist access.
- Verify request body and URL parameter validation.
- Verify production CORS and TLS settings.
- Confirm Kong Admin API and databases are inaccessible from the public network.
- Load-test public and AI endpoints after rate limits are introduced.
- Review dependency audit findings without applying unreviewed bulk upgrades.

## Out of scope

Payment processing, wallet custody, trading execution, and blockchain transaction signing are not implemented by this project.
