# Guía de Despliegue en Render para INEXCONS

## Requisitos Previos

1. Una cuenta en [Render](https://render.com)
2. Repositorio de tu proyecto en GitHub, GitLab o Bitbucket

## Pasos para Desplegar

### Paso 1: Preparar tu Repositorio

Asegúrate de que todos los archivos de configuración estén en tu repositorio:

- render.yaml (configurado con --legacy-peer-deps)
- Procfile (en la carpeta backend)
- runtime.txt (en la carpeta backend)
- .npmrc (en la raíz del proyecto)
- package.json (en la raíz del proyecto con dependencias compatibles)

### Paso 2: Solución de Problemas de Dependencias

Si enfrentas problemas con las dependencias durante el despliegue:

1. Verifica que el archivo `.npmrc` contenga:

   ```
   legacy-peer-deps=true
   engine-strict=false
   ```

2. Asegúrate de que el `package.json` de la raíz contenga versiones compatibles:
   ```json
   {
     "private": true,
     "scripts": {
       "dev": "vite",
       "build": "vite build"
     },
     "devDependencies": {
       "laravel-vite-plugin": "^0.7.8",
       "vite": "^4.0.0"
     }
   }
   ```

### Paso 3: Conectar Render a tu Repositorio

1. Inicia sesión en [Render Dashboard](https://dashboard.render.com)
2. Haz clic en "Blueprint" en el menú de navegación
3. Haz clic en "New Blueprint Instance"
4. Conecta tu cuenta de GitHub, GitLab o Bitbucket
5. Selecciona el repositorio donde está tu proyecto
6. Render detectará automáticamente el archivo `render.yaml` y configurará los servicios

### Paso 4: Configurar Variables de Entorno Adicionales

Si tienes variables que no están incluidas en el archivo `render.yaml`, puedes configurarlas manualmente:

1. Ve a cada servicio en el Dashboard de Render
2. Haz clic en "Environment" en el menú lateral
3. Agrega las variables de entorno necesarias

### Paso 5: Verificar y Finalizar

1. Verifica que todos los servicios estén correctamente configurados
2. Render comenzará a construir y desplegar automáticamente tus servicios
3. Puedes monitorear el progreso de construcción y despliegue en tiempo real

## Estructura del Despliegue

Tu aplicación estará disponible en las siguientes URLs:

- Frontend: https://inexcons-frontend.onrender.com
- Backend API: https://inexcons-backend.onrender.com

## Solución de Problemas Comunes

1. **Error de dependencias npm**:

   - Verifica que los comandos de construcción incluyan `--legacy-peer-deps`
   - Asegúrate de que el archivo `.npmrc` esté correctamente configurado

2. **Error en el inicio del servicio PHP**:

   - Si `php artisan serve` no funciona correctamente, usa `php -S 0.0.0.0:$PORT -t public` como comando de inicio

3. **Problemas con la base de datos**:
   - Verifica que la migración se ejecute correctamente
   - Comprueba que las credenciales de la base de datos estén configuradas

## Notas Importantes

- Render utiliza PostgreSQL como base de datos, asegúrate de que tu aplicación sea compatible
- Los planes gratuitos de Render tienen limitaciones de rendimiento y pueden pausarse tras períodos de inactividad
- Para entornos de producción, considera actualizar a un plan de pago
