# Despliegue en Fly.io

Este documento proporciona instrucciones para desplegar la aplicación INEXCONS en Fly.io.

## Requisitos previos

1. Tener una cuenta en [Fly.io](https://fly.io)
2. Tener instalado el CLI de Fly.io. Puedes instalarlo siguiendo las instrucciones en [https://fly.io/docs/hands-on/install-flyctl/](https://fly.io/docs/hands-on/install-flyctl/)
3. Haber iniciado sesión en Fly.io desde la terminal con `flyctl auth login`

## Pasos para el despliegue

### 1. Configuración inicial

Asegúrate de que tienes los siguientes archivos en la raíz del proyecto:

- `fly.toml`: Configuración principal de Fly.io
- `Dockerfile`: Instrucciones para construir la imagen Docker
- `.dockerignore`: Lista de archivos a ignorar en la construcción de la imagen

### 2. Método automático (recomendado)

Puedes utilizar el script `deploy-fly.sh` incluido en el proyecto para automatizar el proceso de despliegue:

```bash
./deploy-fly.sh
```

El script te guiará a través del proceso, incluyendo la creación de una base de datos PostgreSQL si es necesario.

### 3. Método manual

Si prefieres realizar el despliegue manualmente, sigue estos pasos:

#### 3.1. Crear la aplicación en Fly.io

```bash
flyctl apps create inexcons
```

#### 3.2. Crear una base de datos PostgreSQL (opcional)

```bash
flyctl postgres create --name inexcons-db
flyctl postgres attach --app inexcons inexcons-db
```

#### 3.3. Generar clave de aplicación Laravel

```bash
php backend/artisan key:generate --show
```

Copia la clave generada.

#### 3.4. Configurar secretos

```bash
flyctl secrets set APP_KEY="base64:tu_clave_generada"
```

#### 3.5. Desplegar la aplicación

```bash
flyctl deploy
```

### 4. Verificar el despliegue

Una vez completado el despliegue, puedes acceder a tu aplicación en:

```
https://inexcons.fly.dev
```

## Solución de problemas

### Error 502 Bad Gateway

Si encuentras un error 502, verifica lo siguiente:

1. **Logs de la aplicación**: Revisa los logs para identificar el problema:

   ```bash
   flyctl logs
   ```

2. **Configuración CORS**: Asegúrate de que el dominio `https://inexcons.fly.dev` está incluido en la configuración CORS en:

   - `backend/config/cors.php`
   - `backend/app/Http/Middleware/CorsMiddleware.php`

3. **Variables de entorno**: Verifica que todas las variables de entorno necesarias están configuradas:

   ```bash
   flyctl secrets list
   ```

4. **Reiniciar la aplicación**: A veces, reiniciar la aplicación puede resolver problemas temporales:

   ```bash
   flyctl apps restart inexcons
   ```

5. **Verificar la base de datos**: Asegúrate de que la conexión a la base de datos está configurada correctamente:
   ```bash
   flyctl postgres connect -a inexcons-db
   ```

## Comandos útiles

- **Ver logs**: `flyctl logs`
- **Acceder a la consola**: `flyctl ssh console`
- **Escalar la aplicación**: `flyctl scale count 2` (para tener 2 instancias)
- **Ver información de la aplicación**: `flyctl status`
- **Abrir la aplicación en el navegador**: `flyctl open`
