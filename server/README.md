# AI Teacher API

This small Render service keeps the TinyFish API key on the server.

## Environment variables

- TINYFISH_API_KEY — set this in Render, never in the React app.
- ALLOWED_ORIGIN — normally https://jryoung201-code.github.io

## Endpoints

- GET /health
- POST /api/teacher with { "message", "section", "code" }
