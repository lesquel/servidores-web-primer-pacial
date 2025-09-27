# 04 · App y Server (bootstrap)

Flujo recomendado:

- `app.ts`: crea `express()` y registra middlewares globales, health check y rutas; exporta `app`.
- `server.ts`: importa `app`, arranca `http.createServer(app)` en `PORT` y maneja señales para apagado limpio.

Ejemplo `app.ts`:

```ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import pino from "pino";
import pinoHttp from "pino-http";
import { env } from "./config/env";
import router from "./routes";

const logger = pino({ level: env.LOG_LEVEL });

export const app = express();
app.use(pinoHttp({ logger }));
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api", router);

// 404 y error se manejan en middlewares dedicados (ver capítulos 05 y 08)
```

Ejemplo `server.ts`:

```ts
import { createServer } from "http";
import { app } from "./app";
import { env } from "./config/env";

const server = createServer(app);
const PORT = env.PORT;

server.listen(PORT, () => {
  console.log(`HTTP server listening on http://localhost:${PORT}`);
});

const shutdown = (signal: string) => {
  console.log(`\nReceived ${signal}. Gracefully shutting down...`);
  server.close((err) => {
    if (err) {
      console.error("Error while closing server", err);
      process.exit(1);
    }
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
```

Buenas prácticas:

- Aplica timeouts si esperas conexiones lentas o externas.
- No hagas `app.listen` dentro de tests; exporta `app` para Supertest.
- Usa `pino-http` como middleware para logs de cada request.
