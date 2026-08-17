# API Reference

The examples below use the Kong proxy at `http://localhost:8000`. Request and response validation is currently limited; clients should send the documented JSON shapes.

## Authentication

### Register

`POST /api/auth/register`

```json
{
  "email": "user@example.com",
  "password": "change-me"
}
```

Successful response: `201 Created`

```json
{
  "message": "Account registered successfully"
}
```

### Login

`POST /api/auth/login`

Uses the same request body as registration. Successful response: `201 Created`.

```json
{
  "message": "Login successful",
  "accessToken": "<jwt>",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### Verify token

`POST /api/auth/verify`

Header: `Authorization: Bearer <jwt>`

```json
{
  "valid": true,
  "user": {
    "sub": 1,
    "email": "user@example.com",
    "iat": 0,
    "exp": 0
  }
}
```

## Market data

### List top coins

`GET /api/crypto`

Returns an array of normalized coin records containing identity, rank, price, percentage changes, market cap, volume, supply, seven-day sparkline values, update time, and supported networks.

### Get market overview

`GET /api/crypto/market-overview`

Returns global metrics, CMC20, Fear and Greed data, fetch time, and a `stale` flag. A metric may be `null` when its upstream source is unavailable and no cached value exists.

## Watchlist

All watchlist endpoints require `Authorization: Bearer <jwt>`.

### List items

`GET /api/crypto/watchlist`

### Add an item

`POST /api/crypto/watchlist`

```json
{
  "coinId": "bitcoin"
}
```

Returns `409 Conflict` if the coin already exists in the user's watchlist.

### Remove an item

`DELETE /api/crypto/watchlist/:coinId`

```json
{
  "removed": true,
  "coinId": "bitcoin"
}
```

Returns `404 Not Found` if the item does not exist.

## AI Copilot

### Send a prompt

`POST /api/ai/chat`

```json
{
  "prompt": "Explain Bitcoin market dominance"
}
```

Successful response: `200 OK`

```json
{
  "reply": "<generated response>"
}
```

This endpoint currently has no authentication or application-level rate limit. Do not expose it publicly without the controls described in the threat model.

## WebSocket

Connect a Socket.IO client directly to `http://localhost:3001`.

| Direction | Event | Payload |
| --- | --- | --- |
| Server to client | `price_updates` | Array of normalized coin records; `isUp` may indicate movement from the preceding snapshot |

A newly connected client receives the latest cached snapshot when one is available.

## Common errors

NestJS returns its standard JSON error envelope, typically containing `statusCode`, `message`, and `error`. Expected statuses include `400`, `401`, `404`, `409`, and `500`.
