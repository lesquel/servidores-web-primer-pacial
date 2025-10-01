# 10 · Logging (Pino)

¿Por qué Pino?

- Muy rápido, formato JSON estructurado, integraciones.

Instancia global:

```ts
// src/config/logger.ts
import pino from "pino";
import { env } from "./env";
export const logger = pino({ level: env.LOG_LEVEL });
```

Logs por request:

```ts
import pinoHttp from "pino-http";
import { logger } from "../config/logger";
app.use(pinoHttp({ logger }));
```

Buenas prácticas:

- Registra `req.id` (usa un gen. de IDs si lo necesitas), método, ruta, latencia.
- En producción, envía logs a STDOUT y usa un agregador (ELK, Loki, etc.).
