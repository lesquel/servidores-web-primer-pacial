# 05 · Middlewares

Tipos:

- Globales: aplican a toda la app (JSON parser, CORS, Helmet, Logger, Rate-limit).
- Específicos: por ruta (validación, autorización).

Orden sugerido:

1. `pino-http` (logging)
2. `helmet` (seguridad de cabeceras)
3. `cors`
4. `compression`
5. `express.json()` y `express.urlencoded()`
6. rate-limit
7. tus middlewares (auth, validate)
8. rutas
9. not-found y error handler final

Ejemplo de rate-limit:

```ts
import rateLimit from "express-rate-limit";
import { env } from "../config/env";

export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS, // 1 min
  max: env.RATE_LIMIT_MAX, // 100 req/min
  standardHeaders: true,
  legacyHeaders: false,
});
```

Uso:

```ts
import { apiLimiter } from "./presentation/middlewares/rate-limit";
app.use("/api", apiLimiter);
```

Notas (Express 5):

- Soporta promesas en middlewares/controladores: puedes `throw` y caerá al error handler.
- `express.Router` tiene mejoras y opciones adicionales.
