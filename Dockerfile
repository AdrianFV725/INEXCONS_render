FROM php:8.2-apache

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    zip \
    unzip \
    nodejs \
    npm

# Borrar cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar extensiones PHP
RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

# Configurar apache
COPY backend/public /var/www/html/public
COPY backend /var/www/backend
WORKDIR /var/www/backend

# Obtener composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Establecer variables de entorno para Apache
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Habilitar mod_rewrite
RUN a2enmod rewrite

# Instalar dependencias de PHP
RUN composer install --no-interaction --no-dev --optimize-autoloader

# Instalar dependencias de Node.js
RUN npm ci --legacy-peer-deps && npm run build

# Configurar permisos
RUN chown -R www-data:www-data /var/www/backend
RUN chmod -R 755 /var/www/backend/storage

# Variables de entorno
ENV PORT=8080
ENV APP_ENV=production
ENV APP_DEBUG=false

# Exponer puerto
EXPOSE 8080

# Comando para iniciar Apache
CMD apache2-foreground 