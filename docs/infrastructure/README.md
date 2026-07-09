# Infrastructure Overview

The project uses a single-container Docker deployment with Nginx as the HTTP server and PHP-FPM as the application processor. There is no separate database, cache, or message queue service -- all data flows through live web scraping of wilottery.com at request time.

```
Host :5959 --> Nginx:80 --> (static files from /var/www/html/frontend/)
                        --> (API proxy) PHP-FPM on 127.0.0.1:9000 --> backend/api.php
```

## Files

| File | Description |
|------|-------------|
| [Docker Configuration](./docker.md) | Dockerfile layer breakdown, docker-compose.yml configuration, volume mounts, environment variables, startup process (`/start.sh`), and multi-stage build notes. |
| [Nginx Configuration](./nginx.md) | Reverse proxy setup, port mapping, routing rules (static assets, SPA fallback, API proxy), FastCGI configuration, gzip compression, SSL/TLS status, and security observations. |

## Architecture Summary

- **Container:** Single container (`lottery-codex`) running both Nginx and PHP-FPM via `/start.sh`.
- **Port mapping:** Host port 5959 maps to container port 80 (Nginx).
- **Data persistence:** None. No named volumes. Backend source is volume-mounted for live editing; frontend `dist/` is baked into the image at build time. Logs are ephemeral.
- **Timezone:** `America/Chicago`, set via both docker-compose.yml environment variable and Dockerfile INI configuration (redundant).
- **No SSL/TLS:** HTTP only, no certificate configuration.
