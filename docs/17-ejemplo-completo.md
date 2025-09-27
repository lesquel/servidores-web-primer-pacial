# 17 · Ejemplo completo (mini API Users)

Este ejemplo combina los capítulos previos. Carpeta `src`:

```
src/
  app.ts
  server.ts
  config/
    env.ts
    logger.ts
  routes/
    index.ts
    users.routes.ts
  presentation/
    controllers/UsersController.ts
    middlewares/validate.middleware.ts
    middlewares/error.middleware.ts
  domain/
    entities/User.ts
    repositories/IUserRepository.ts
  infrastructure/
    repositories/UserRepositoryInMemory.ts
```

`domain/entities/User.ts`:

```ts
export interface User {
  id: string;
  name: string;
  email: string;
  active: boolean;
}
```

`domain/repositories/IUserRepository.ts`:

```ts
export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  create(data: Omit<User, "id" | "active">): Promise<User>;
  update(id: string, data: Partial<Omit<User, "id">>): Promise<User | null>;
  remove(id: string): Promise<boolean>;
}
```

`infrastructure/repositories/UserRepositoryInMemory.ts`:

```ts
import { randomUUID } from "node:crypto";

export class UserRepositoryInMemory implements IUserRepository {
  private users: User[] = [];
  async findAll() {
    return this.users;
  }
  async findById(id: string) {
    return this.users.find((u) => u.id === id) ?? null;
  }
  async create(data: Omit<User, "id" | "active">) {
    const user = { id: randomUUID(), active: true, ...data };
    this.users.push(user);
    return user;
  }
  async update(id: string, data: Partial<Omit<User, "id">>) {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.users[idx] = { ...this.users[idx], ...data };
    return this.users[idx];
  }
  async remove(id: string) {
    const before = this.users.length;
    this.users = this.users.filter((u) => u.id !== id);
    return this.users.length < before;
  }
}
```

`presentation/controllers/UsersController.ts`: ver capítulo 06.

`routes/users.routes.ts`: ver capítulo 06.

`app.ts` y `server.ts`: ver capítulo 04.

Con esto tienes una API funcional para crear/listar/actualizar/eliminar usuarios en memoria.
