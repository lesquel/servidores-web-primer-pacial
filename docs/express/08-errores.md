# 08 · Manejo de errores centralizado

Estrategia:

- Usa clases de error propias (BadRequestError, NotFoundError, etc.).
- Un middleware de error final traduce errores a respuestas HTTP.

Errores personalizados:

```ts
export class AppError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(404, message);
  }
}
```

Middleware de error:

```ts
import { NextFunction, Request, Response } from "express";
import { AppError } from "./app-error";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res
      .status(err.status)
      .json({ message: err.message, details: err.details });
  }
  // Zod
  if (err?.errors && Array.isArray(err.errors)) {
    return res
      .status(400)
      .json({ message: "Validation error", issues: err.errors });
  }
  return res.status(500).json({ message: "Internal Server Error" });
}
```

Ubicación:

- Registra `errorHandler` al final de `app.ts`.

Tips:

- En producción, no devuelvas stack traces.
- Loggea el error con Pino antes de responder.
