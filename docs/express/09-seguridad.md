# 09 · Seguridad

Medidas esenciales:

- CORS restringido: permite solo orígenes confiables.
- Helmet: cabeceras de seguridad (XSS, MIME sniffing, etc.).
- Rate-limit: frena abuso de endpoints.
- Sanitización: valida y normaliza inputs.
- HTTPS siempre en producción (proxy o terminación TLS).

Ejemplo CORS:

```ts
import cors from "cors";
app.use(
  cors({
    origin: ["https://tu-dominio.com", "http://localhost:4200"],
    credentials: true,
  })
);
```

Helmet:

```ts
import helmet from "helmet";
app.use(helmet());
```

Rate limit: ver capítulo 05.

Otros:

- Usa tokens firmados/expiran (JWT) y rotate refresh tokens.
- No loggear datos sensibles.
- Limitar tamaño de body (`express.json({ limit: '1mb' })`).
