# 03 · Configuración de ambiente (.env y config)

Usa variables de entorno para parámetros sensibles y que cambian por ambiente (dev, test, prod).

Ejemplo `.env`:

```
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:4200
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
```

Validación con `envalid` (recomendado):

```ts
// src/config/env.ts
import { cleanEnv, num, str } from "envalid";

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ["development", "test", "production"] }),
  PORT: num({ default: 3000 }),
  LOG_LEVEL: str({ default: "info" }),
  CORS_ORIGIN: str({ default: "*" }),
  RATE_LIMIT_WINDOW_MS: num({ default: 60_000 }),
  RATE_LIMIT_MAX: num({ default: 100 }),
});
```

Consejos:

- No hardcodees secretos; usa .env.local (no commitear) o gestores (Vault, Doppler).
- Separa config por ambiente con prefijos o múltiples archivos .env.
- Inyecta config a módulos a través de funciones o singletons claros.
