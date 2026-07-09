# Nginx Configuration

**File:** `docker/nginx.conf` (copied to `/etc/nginx/sites-available/default` in the container)

## Overview

Nginx serves as both static file server for the React SPA and reverse proxy routing API requests to PHP-FPM. Both services run inside the same Docker container, communicating over TCP loopback (`127.0.0.1:9000`).

## Document Root

`/var/www/html/frontend` -- the Vite production build output directory. The `index.html` file is the default index and SPA entry point.

## Routing Rules (in order of specificity)

### Static Assets (highest priority)

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

Files matching these extensions get a 1-year expiry and `Cache-Control: public, immutable` header. This is optimal for Vite's content-hashed filenames (`app.[hash].js`) since the browser never needs to revalidate them.

### SPA Fallback (catch-all)

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Any request that does not match a real file or directory falls back to `index.html`. This allows client-side routing (React Router) to work -- the browser navigates to `/games/badger-five`, Nginx serves `index.html`, and React handles the route on the client.

### API Proxy to PHP-FPM

```nginx
location /api/ {
    include fastcgi_params;

    fastcgi_pass 127.0.0.1:9000;
    fastcgi_param SCRIPT_FILENAME /var/www/html/backend/api.php;
    fastcgi_param PATH_INFO $fastcgi_path_info;
}
```

All requests under `/api/` are forwarded to PHP-FPM via FastCGI on TCP port 9000. Every request funnels through the single entry point `backend/api.php`, where Slim Framework parses the URI path for route matching (`PATH_INFO` is passed through).

## FastCGI Configuration Details

| Directive | Value | Purpose |
|-----------|-------|---------|
| `fastcgi_pass` | `127.0.0.1:9000` | TCP connection to PHP-FPM (not a unix socket) |
| `SCRIPT_FILENAME` | `/var/www/html/backend/api.php` | Hardcoded entry point -- all API requests use the same file |
| `PATH_INFO` | `$fastcgi_path_info` | Passed so Slim can parse route parameters from URI path |

## Compression

Gzip is enabled for text-based content types:

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
gzip_min_length 1000;
```

Minimum response length of 1000 bytes before compression kicks in. The `gzip_vary` directive is **not** set, which means downstream caches cannot properly handle Vary: Accept-Encoding headers.

## Security Observations

- No security headers are configured (no `X-Content-Type-Options`, `X-Frame-Options`, Content-Security-Policy, etc.).
- `server_name ats.heise.home` is hardcoded to a local hostname. This is fine inside the container since there is only one server block and no virtual hosting.
- No rate limiting or request size limits (`client_max_body_size`) are configured.

## SSL/TLS

Not configured. Nginx listens on port 80 (HTTP only). There is no certificate configuration, no HTTPS redirect, and no TLS termination. This is acceptable for a local development container but would need to be addressed in production behind a reverse proxy or load balancer.
