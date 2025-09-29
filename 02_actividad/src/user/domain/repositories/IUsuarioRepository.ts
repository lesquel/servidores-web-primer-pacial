import { Rol, Usuario } from "../entities/Usuario";

export interface UsuarioCreate {
  nombre: string;
  email: string;
  rol: Rol;
}

export interface UsuarioUpdate {
  nombre?: string;
  email?: string;
  rol?: Rol;
  activo?: boolean;
}

export interface IUsuarioRepository {
  // CREATE - Usando Callbacks (error, resultado)
  crear(
    data: UsuarioCreate,
    callback: (error: Error | null, resultado: Usuario | null) => void
  ): void;

  // UPDATE - Retornando Promise<Usuario>
  actualizar(id: string, data: UsuarioUpdate): Promise<Usuario>;

  // READ - Async functions retornando Promise
  obtenerPorId(id: string): Promise<Usuario | null>;
  obtenerTodosActivos(): Promise<Usuario[]>;

  // DELETE - Async function retornando Promise<boolean>
  eliminar(id: string, eliminacionFisica?: boolean): Promise<boolean>;
}
