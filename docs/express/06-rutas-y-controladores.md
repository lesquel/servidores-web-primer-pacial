# 06 · Rutas y Controladores

Patrones recomendados:

- Router por recurso (users, products, orders).
- Controladores finos que delegan en casos de uso (application/services).
- Respuestas con códigos HTTP adecuados y DTOs consistentes.

Ejemplo `routes/users.routes.ts`:

```ts
import { Router } from "express";
import { UsersController } from "../presentation/controllers/UsersController";
import { validate } from "../presentation/middlewares/validate.middleware";
import { createUserSchema } from "../presentation/dto/user.dto";

const router = Router();

router.get("/", UsersController.list);
router.get("/:id", UsersController.getById);
router.post("/", validate(createUserSchema), UsersController.create);
router.put(
  "/:id",
  validate(createUserSchema.partial()),
  UsersController.update
);
router.delete("/:id", UsersController.remove);

export default router;
```

Router raíz `routes/index.ts`:

```ts
import { Router } from "express";
import users from "./users.routes";

const router = Router();
router.use("/users", users);
export default router;
```

Controlador `UsersController.ts` (ejemplo):

```ts
import { Request, Response } from "express";
import { StatusCodes as Status } from "http-status-codes";
import { container } from "../../application/container";

export class UsersController {
  static list = async (_req: Request, res: Response) => {
    const service = container.resolve("ListUsers");
    const result = await service.execute();
    return res.status(Status.OK).json(result);
  };

  static getById = async (req: Request, res: Response) => {
    const service = container.resolve("GetUserById");
    const result = await service.execute(req.params.id);
    return res.status(Status.OK).json(result);
  };

  static create = async (req: Request, res: Response) => {
    const service = container.resolve("CreateUser");
    const result = await service.execute(req.body);
    return res.status(Status.CREATED).json(result);
  };

  static update = async (req: Request, res: Response) => {
    const service = container.resolve("UpdateUser");
    const result = await service.execute(req.params.id, req.body);
    return res.status(Status.OK).json(result);
  };

  static remove = async (req: Request, res: Response) => {
    const service = container.resolve("RemoveUser");
    await service.execute(req.params.id);
    return res.status(Status.NO_CONTENT).send();
  };
}
```

Consejos:

- Evita lógica de negocio en los controladores.
- Usa `async/await` y `throw` para flujos de error (Express 5 los captura).
