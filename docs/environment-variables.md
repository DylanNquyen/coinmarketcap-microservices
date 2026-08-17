# Environment Variables

Copy each committed `.env.example` file to `.env` in the same directory. Real `.env` files are ignored by Git and must never contain values intended for source control.

## Frontend

File: `frontend/.env`

| Variable | Required | Default in code | Purpose |
| --- | --- | --- | --- |
| `VITE_API_URL` | No | `http://localhost:8000` | Base URL for HTTP requests routed through Kong |
| `VITE_WS_URL` | No | `http://localhost:3001` | Socket.IO endpoint for market updates |

All `VITE_` variables are embedded into the browser bundle at build time. They must not contain secrets.

## Crypto service

File: `backend/.env`

| Variable | Required | Default in code | Purpose |
| --- | --- | --- | --- |
| `GEMINI_API_KEY` | Required for AI | Invalid placeholder | Authenticates requests to Gemini |
| `COIN_REFRESH_INTERVAL_MS` | No | `180000` | Interval between upstream market refreshes |

Use a positive integer for `COIN_REFRESH_INTERVAL_MS`. Very short intervals may trigger upstream rate limits.

## Authentication service

The authentication service currently has no runtime environment variables. Its database connection and JWT configuration are hard-coded for local development. This is documented as technical debt rather than represented by a misleading `.env.example` file.

## Infrastructure values

Local MySQL and Kong credentials are defined directly in `docker-compose.yml`. These values are development-only. Production deployments should inject secrets from the deployment platform and should not expose database or Kong Admin ports publicly.

## Secret-handling rules

- Never commit `.env` files, API keys, JWT secrets, or production database credentials.
- Rotate a secret immediately if it appears in Git history, logs, screenshots, or issue content.
- Keep frontend variables public-only because browser users can inspect them.
- Use separate credentials for development, test, staging, and production.
