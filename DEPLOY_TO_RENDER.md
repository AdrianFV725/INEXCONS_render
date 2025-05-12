# Guía de Despliegue en Render para INEXCONS

## Requisitos Previos

1. Una cuenta en [Render](https://render.com)
2. Repositorio de tu proyecto en GitHub, GitLab o Bitbucket

## Pasos para Desplegar

### Paso 1: Preparar tu Repositorio

Asegúrate de que todos los archivos de configuración estén en tu repositorio:

- render.yaml (configurado con runtime: php para el backend)
- render-service.yaml (configuración alternativa si render.yaml no funciona)
- Procfile (en la carpeta backend)
- runtime.txt (en la carpeta backend)
- .npmrc (en la raíz del proyecto)
- package.json (en la raíz del proyecto con scripts simples)
- build.sh (script ejecutable en la raíz)

### Paso 2: Solución de Problemas de Dependencias

Si enfrentas problemas con las dependencias durante el despliegue:

1. Verifica que el archivo `.npmrc` contenga:

   ```
   legacy-peer-deps=true
   engine-strict=false
   ```

2. Asegúrate de que el `package.json` de la raíz no intente construir nada:
   ```json
   {
     "private": true,
     "scripts": {
       "dev": "echo 'No development script in root'",
       "build": "echo 'No build script in root'"
     },
     "devDependencies": {
       "laravel-vite-plugin": "^0.7.8",
       "vite": "^4.0.0"
     }
   }
   ```

### Paso 3: Despliegue Manual de Servicios

En lugar de usar Blueprint, despliega manualmente cada servicio:

1. **Backend**:

   - Inicia sesión en [Render Dashboard](https://dashboard.render.com)
   - Crea un nuevo "Web Service"
   - Conecta tu repositorio
   - Configura el servicio:
     - **IMPORTANTE**: Selecciona el Runtime como "PHP" (no Node)
     - PHP Version: 8.2
     - Build Command: `cd backend && composer install --no-interaction --prefer-dist --optimize-autoloader && npm ci --legacy-peer-deps && npm run build && php artisan migrate --force`
     - Start Command: `cd backend && php -S 0.0.0.0:$PORT -t public`
     - Configura las variables de entorno necesarias

2. **Frontend**:

   - Crea un nuevo "Static Site"
   - Conecta el mismo repositorio
   - Configura el servicio:
     - Build Command: `cd frontend && npm ci --legacy-peer-deps && npm run build`
     - Publish Directory: `frontend/dist`
     - Configura cualquier variable de entorno necesaria

3. **Base de Datos**:
   - Crea un nuevo servicio de base de datos PostgreSQL
   - Anota las credenciales para configurarlas en tu backend

### Paso 4: Configurar Variables de Entorno

Para cada servicio, configura las variables de entorno necesarias:

1. **Backend**:

   - APP_ENV: production
   - APP_DEBUG: false
   - APP_URL: URL de tu backend
   - DB_CONNECTION: pgsql
   - DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD: credenciales de la base de datos
   - APP_KEY: genera una clave nueva o usa una existente
   - PHP_VERSION: 8.2

2. **Frontend**:
   - VITE_BACKEND_URL: URL de tu backend API
   - NODE_VERSION: 18

### Paso 5: Verificar y Finalizar

1. Verifica que todos los servicios estén correctamente configurados
2. Render comenzará a construir y desplegar automáticamente tus servicios
3. Puedes monitorear el progreso de construcción y despliegue en tiempo real

## Estructura del Despliegue

Tu aplicación estará disponible en las siguientes URLs:

- Frontend: https://inexcons-frontend.onrender.com
- Backend API: https://inexcons-backend.onrender.com

## Solución de Problemas Comunes

1. **Error "composer: command not found"**:

   - Asegúrate de que el runtime seleccionado sea PHP y no Node.js
   - Verifica que la versión de PHP esté especificada como variable de entorno (PHP_VERSION=8.2)

2. **Error de construcción en la raíz**:

   - Usa el script `build.sh` proporcionado que simplemente retorna éxito
   - Modifica el package.json para que no intente construir nada en la raíz

3. **Error de entradas en vite.config.js**:

   - Comenta o elimina las líneas de entrada que apuntan a archivos inexistentes
   - Si es necesario, crea los archivos CSS/JS mínimos necesarios para la construcción

4. **Error en el inicio del servicio PHP**:

   - Si `php artisan serve` no funciona correctamente, usa `php -S 0.0.0.0:$PORT -t public` como comando de inicio

5. **Problemas con la base de datos**:
   - Verifica que la migración se ejecute correctamente
   - Comprueba que las credenciales de la base de datos estén configuradas

## Despliegue Paso a Paso en Render (Alternativa)

Si sigues teniendo problemas con el despliegue Blueprint, sigue estos pasos específicos:

1. Inicia sesión en Render
2. Ve a "Dashboard" y haz clic en "New +"
3. Selecciona "Web Service" para el backend
4. Conecta tu repositorio GitHub
5. **IMPORTANTE**: En la configuración, selecciona "PHP" como Runtime (no Node.js)
6. Configura el servicio con los detalles mencionados anteriormente
7. Repite el proceso para el frontend seleccionando "Static Site"
8. Configura las variables de entorno manualmente para cada servicio

## Notas Importantes

- Render utiliza PostgreSQL como base de datos, asegúrate de que tu aplicación sea compatible
- Los planes gratuitos de Render tienen limitaciones de rendimiento y pueden pausarse tras períodos de inactividad
- Para entornos de producción, considera actualizar a un plan de pago
