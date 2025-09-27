# 12 · Tests (Jest + Supertest)

¿Por qué?

- Asegurar comportamiento, prevenir regresiones, refactor seguro.

Setup básico:

```ts
// jest.config.ts
import type { Config } from "jest";
const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
};
export default config;
```

Test de integración:

```ts
import request from "supertest";
import { app } from "../src/app";

describe("Health", () => {
  it("GET /health -> 200", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
```

Consejos:

- Usa repositorios en memoria o DB de test.
- Semilla y limpia datos entre tests si usas DB real.
