# 11 · Documentación API (OpenAPI/Swagger)

Opciones:

- Escribir `openapi.yaml` a mano y servirlo con `swagger-ui-express`.
- Generar a partir de anotaciones/comentarios (no recomendado para TS puro).

Servir OpenAPI:

```ts
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import path from "node:path";

const spec = fs.readFileSync(
  path.join(__dirname, "../docs/openapi.yaml"),
  "utf-8"
);
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, { swaggerOptions: { url: "/openapi.yaml" } })
);
app.get("/openapi.yaml", (_req, res) => res.type("text/yaml").send(spec));
```

Tips:

- Mantén los ejemplos actualizados.
- Describe errores y esquemas de respuesta.
- Usa tags por recurso y versiona (`/api/v1`).
