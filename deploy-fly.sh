#!/bin/bash

# Script para desplegar en Fly.io

# Asegurarse de que fly CLI está instalado
if ! command -v flyctl &> /dev/null; then
    echo "Error: flyctl no está instalado. Por favor, instálalo primero."
    echo "Visita https://fly.io/docs/hands-on/install-flyctl/ para instrucciones."
    exit 1
fi

# Verificar si ya hay una aplicación creada
if ! flyctl apps list | grep -q "inexcons"; then
    echo "Creando nueva aplicación en Fly.io..."
    flyctl apps create inexcons
else
    echo "La aplicación 'inexcons' ya existe en Fly.io."
fi

# Verificar si se necesita crear una base de datos PostgreSQL
read -p "¿Deseas crear una nueva base de datos PostgreSQL en Fly.io? (s/n): " create_db
if [[ "$create_db" == "s" ]]; then
    echo "Creando base de datos PostgreSQL..."
    flyctl postgres create --name inexcons-db
    
    # Adjuntar la base de datos a la aplicación
    echo "Adjuntando base de datos a la aplicación..."
    flyctl postgres attach --app inexcons inexcons-db
fi

# Generar clave de aplicación Laravel
echo "Generando clave de aplicación Laravel..."
php backend/artisan key:generate --show

# Solicitar la clave generada para incluirla en el despliegue
read -p "Copia la clave generada y pégala aquí: " app_key

# Configurar secretos
echo "Configurando secretos..."
flyctl secrets set APP_KEY="$app_key"

# Desplegar la aplicación
echo "Desplegando aplicación en Fly.io..."
flyctl deploy

echo "Despliegue completado. La aplicación estará disponible en https://inexcons.fly.dev" 