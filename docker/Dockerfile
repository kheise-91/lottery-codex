FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set timezone to America/Chicago
RUN apt-get update && apt-get install -y tzdata \
    && ln -fs /usr/share/zoneinfo/America/Chicago /etc/localtime \
    && echo 'America/Chicago' > /etc/timezone \
    && dpkg-reconfigure -f noninteractive tzdata \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd

# Set PHP timezone
RUN echo 'date.timezone = America/Chicago' > /usr/local/etc/php/conf.d/timezone.ini

# Install nginx
RUN apt-get update && apt-get install -y \
    nginx \
    && rm -rf /var/lib/apt/lists/*

# Configure PHP-FPM to listen on TCP port 9000
RUN sed -i 's|^listen = .*|listen = 127.0.0.1:9000|' /usr/local/etc/php-fpm.d/www.conf

# Configure PHP-FPM to run as www-data
RUN sed -i 's/^user = .*/user = www-data/' /usr/local/etc/php-fpm.d/www.conf
RUN sed -i 's/^group = .*/group = www-data/' /usr/local/etc/php-fpm.d/www.conf

# Disable display_errors for production safety; log errors to file instead
RUN printf 'display_errors = Off\nlog_errors = On\nerror_log = /var/log/php/error.log\n' > /usr/local/etc/php/conf.d/99-custom.ini

# Create error log directory, writable by PHP-FPM (runs as www-data)
RUN mkdir -p /var/log/php && chown www-data:www-data /var/log/php

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/sites-available/default

# Set working directory
WORKDIR /var/www/html

# Copy backend files
COPY backend/ ./backend/

# Copy frontend build output (Vite outputs to 'dist' by default)
COPY frontend/dist/ ./frontend/

# Create startup script that fixes permissions
RUN echo '#!/bin/sh' > /start.sh
RUN echo 'php-fpm -D && nginx -g "daemon off;"' >> /start.sh
RUN chmod +x /start.sh

# Expose port 80
EXPOSE 80

# Use the startup script
CMD ["/start.sh"]
