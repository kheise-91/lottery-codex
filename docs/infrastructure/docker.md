# Docker Configuration

## Overview

Single-container monolithic design: one container (`lottery-codex`) runs both Nginx (HTTP server) and PHP-FPM (application processor). No separate database, cache, or worker services. The backend scrapes wilottery.com via cURL at request time -- no persistent data store is used.

```
Host :5959 --> Nginx:80 --> (static files from /var/www/html/frontend/)
                        --> (API proxy) PHP-FPM on 127.0.0.1:9000 --> backend/api.php
```

## Dockerfile

**File:** `docker/Dockerfile`

| Property | Value |
|----------|-------|
| Base Image | `php:8.2-fpm` (Debian-based, slim) |
| Co-installed Service | Nginx (via apt-get in same image) |
| Working Directory | `/var/www/html` |
| Exposed Port | 80 |
| CMD | `/start.sh` |

### Layer Breakdown

1. **System dependencies** -- `libpng-dev`, `libjpeg-dev`, `libfreetype6-dev`, `curl`. Build deps for PHP GD extension + runtime cURL support. Cleans apt cache.
2. **Timezone setup** -- Installs `tzdata` and configures timezone to `America/Chicago`. Separate layer from step 1 (redundant `apt-get update`).
3. **PHP GD extension** -- Configured with FreeType + JPEG, compiled via `docker-php-ext-install gd`.
4. **PHP timezone INI** -- Writes `date.timezone = America/Chicago` to `/usr/local/etc/php/conf.d/timezone.ini`.
5. **Nginx installation** -- Installs Nginx via apt-get (third redundant `apt-get update`).
6. **PHP-FPM TCP listen** -- Patches `/usr/local/etc/php-fpm.d/www.conf`: sets `listen = 127.0.0.1:9000`.
7. **PHP-FPM user/group** -- Sets both to `www-data` in the same config file.
8. **Production safety INI** -- Writes `display_errors = Off`, `log_errors = On`, `error_log = /var/log/php/error.log` to `/usr/local/etc/php/conf.d/99-custom.ini`. Creates log directory with correct ownership.
9. **Nginx config** -- Copies host `docker/nginx.conf` to `/etc/nginx/sites-available/default`.
10. **Backend source** -- `COPY backend/ ./backend/` (volume-mounted at runtime for live editing).
11. **Frontend build output** -- `COPY frontend/dist/ ./frontend/` (baked in at build time; any frontend change requires `docker compose up --build`).
12. **Startup script** -- Creates `/start.sh` via two inline echo commands, makes it executable.

### Notable Issues

- Three separate `apt-get update` calls across layers could be consolidated into a single layer for smaller image size and faster rebuilds.
- No HEALTHCHECK directive is defined in docker-compose.yml or the Dockerfile for either Nginx or PHP-FPM.
- The startup script uses two `RUN echo` commands instead of a single heredoc, making it harder to read and modify.

## docker-compose.yml

**File:** `docker-compose.yml`

| Property | Value |
|----------|-------|
| Service name | `lottery-codex` |
| Container name | `lottery-codex` |
| Build context | Project root (`.`) |
| Dockerfile | `docker/Dockerfile` |
| Restart policy | `unless-stopped` |
| Port mapping | `5959:80` (host:container) |

### Volume Mounts

| Host Path | Container Path | Mode | Purpose |
|-----------|----------------|------|---------|
| `./backend` | `/var/www/html/backend` | `rw` | Live code editing -- backend changes reflected immediately without rebuild. |

Only the backend directory is volume-mounted. The frontend `dist/` is baked into the image at build time and cannot be edited hot. No named volumes exist for persistence (PHP error logs and Nginx access/error logs are ephemeral).

### Environment Variables

| Variable | Value | Scope |
|----------|-------|-------|
| `TZ=America/Chicago` | Passed via docker-compose.yml environment section | Container-wide (affects system clock, PHP date functions) |

Note: The Dockerfile also writes `date.timezone = America/Chicago` to a PHP INI file, making this redundant.

## Startup Process (`/start.sh`)

```sh
#!/bin/sh
php-fpm -D && nginx -g "daemon off;"
```

1. `php-fpm -D` starts PHP-FPM as a **background daemon** (detached).
2. `nginx -g "daemon off;"` starts Nginx in the **foreground**. Docker expects PID 1 to be long-running; this keeps the container alive and allows graceful signal handling (SIGTERM) for shutdown.

## Multi-Stage Build

Not used. The Dockerfile uses a single-stage build where all dependencies, extensions, and services are installed in one image. This is acceptable for development but increases image size compared to a multi-stage approach that would separate build-time deps from runtime.
