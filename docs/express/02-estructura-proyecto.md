# 02 · Estructura de proyecto sugerida

Basada en arquitectura por capas y separación de responsabilidades:

```
src/
  app.ts              # Construcción de la app Express (middlewares globales)
  server.ts           # Arranque de servidor HTTP
  config/
    env.ts            # Carga y validación de variables de entorno (envalid)
    logger.ts         # Instancia de Pino
  routes/
    index.ts          # Router raíz (agrega subrutas)
    users.routes.ts   # Rutas de usuarios (ejemplo)
  presentation/
    controllers/
      UsersController.ts
    middlewares/
      error.middleware.ts
      not-found.middleware.ts
      validate.middleware.ts
  application/
    services/         # Casos de uso / lógica de aplicación
  domain/
    entities/         # Entidades de dominio
    repositories/     # Puertos/interfaces
  infrastructure/
    repositories/     # Adaptadores / persistencia (ej: memoria, DB)
  docs/
    openapi.yaml      # Esquema OpenAPI (opcional)
```

Claves:

- `app.ts` solo configura middlewares y rutas; no arranca el server.
- `server.ts` crea el HTTP server y maneja señales (SIGTERM) para shutdown.
- `presentation` no sabe de persistencia; llama casos de uso de `application`.
- `domain` define contratos y reglas; es agnóstico de Express.
- `infrastructure` implementa los contratos (repositorios, servicios externos).
