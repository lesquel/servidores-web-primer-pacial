# 07 · Validación (Zod + DTOs)

Por qué Zod:

- Esquemas en TypeScript con inferencia de tipos.
- Validación declarativa y segura.

DTO de usuario `presentation/dto/user.dto.ts`:

```ts
import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
```

Middleware genérico `validate.middleware.ts`:

```ts
import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      return next();
    } catch (err: any) {
      return res.status(400).json({
        message: "Validation error",
        issues: err.errors,
      });
    }
  };
```

Uso en rutas: ver capítulo 06.

Consejos:

- Separa DTOs de entrada/salida.
- Valida params/query con esquemas aparte cuando sea necesario.
