# Guía de Despliegue en Render con Docker para INEXCONS

## Requisitos Previos

1. Una cuenta en [Render](https://render.com)
2. Repositorio de tu proyecto en GitHub, GitLab o Bitbucket

## Archivos Configurados

Se han configurado los siguientes archivos para el despliegue en Docker:

- `Dockerfile`: Configuración para crear la imagen de Docker con PHP 8.2, Apache, Composer y todas las dependencias necesarias.
- `docker-compose.yml`: Configuración para desarrollo local con PostgreSQL.
- `.dockerignore`: Archivos que no se incluirán en la imagen de Docker.
- `.env-docker`: Variables de entorno para Docker.

## Pasos para Desplegar en Render

### Paso 1: Crear un Servicio Web

1. Inicia sesión en tu [Dashboard de Render](https://dashboard.render.com)
2. Haz clic en "New" y selecciona "Web Service"
3. Conecta tu repositorio de GitHub/GitLab/Bitbucket
4. Selecciona el repositorio que contiene tu aplicación

### Paso 2: Configurar el Servicio

1. En "Environment", selecciona "Docker"
2. El nombre del servicio puede ser "inexcons-backend" o como prefieras
3. La rama debería ser "main" o la que uses para producción
4. Asegúrate de que Docker esté seleccionado como el entorno

### Paso 3: Configurar Variables de Entorno

En la sección de "Environment Variables", añade las siguientes variables:

```
APP_ENV=production
APP_DEBUG=false
APP_KEY=[tu_app_key]
DB_CONNECTION=pgsql
DB_HOST=[render_postgres_host]
DB_PORT=5432
DB_DATABASE=[nombre_database]
DB_USERNAME=[username]
DB_PASSWORD=[password]
```

También puedes añadir otras variables que tu aplicación necesite.

### Paso 4: Configurar Base de Datos

1. Crea un servicio de PostgreSQL en Render desde el dashboard
2. Anota las credenciales que Render proporciona
3. Usa estas credenciales para configurar las variables de entorno DB\_\* en tu servicio web

### Paso 5: Opciones Avanzadas

1. Si necesitas ejecutar comandos después del despliegue (como migraciones):
   - En la sección "Advanced", puedes configurar un "Health Check Path" como "/api/health" o cualquier ruta que confirme que tu aplicación está funcionando

### Paso 6: Desplegar

1. Haz clic en "Create Web Service"
2. Render construirá automáticamente tu Docker container y lo desplegará
3. El proceso tardará unos minutos; puedes seguir el progreso en los logs

## Solución de Problemas

### La Aplicación No Arranca

Verifica los logs en Render para ver qué está fallando. Problemas comunes:

1. **Error de conexión a la base de datos**:

   - Verifica que las credenciales de la base de datos son correctas
   - Asegúrate de que la base de datos PostgreSQL esté creada y accesible

2. **Error de permisos**:

   - Verifica que los permisos en el Dockerfile sean correctos
   - Los directorios de storage y bootstrap/cache deben ser escribibles

3. **Error en la compilación de assets**:
   - Verifica los errores de npm en los logs de construcción

## Notas Importantes

- El despliegue inicial puede tardar hasta 10-15 minutos
- Los cambios posteriores serán más rápidos
- Render puede pausar los servicios en planes gratuitos después de períodos de inactividad
- Considera configurar un trabajo cron para mantener el servicio activo

## Comandos Útiles para Pruebas Locales

Para probar localmente antes de desplegar:

```bash
# Construir y arrancar los contenedores
docker-compose --env-file .env-docker up -d

# Ver logs
docker-compose logs -f

# Ejecutar comandos en el contenedor de la aplicación
docker-compose exec app php artisan migrate
```
