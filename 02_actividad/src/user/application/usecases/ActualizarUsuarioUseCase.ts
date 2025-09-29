import {
  IUsuarioRepository,
  UsuarioUpdate,
} from "../../domain/repositories/IUsuarioRepository";
import { Usuario } from "../../domain/entities/Usuario";

export class ActualizarUsuarioUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(id: string, data: UsuarioUpdate): Promise<Usuario> {
    const usuarioExistente = await this.usuarioRepository.obtenerPorId(id);
    if (!usuarioExistente) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }

    if (
      data.nombre !== undefined &&
      (!data.nombre || data.nombre.trim().length === 0)
    ) {
      throw new Error("El nombre no puede estar vacío");
    }

    if (data.email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!data.email || !emailRegex.test(data.email)) {
        throw new Error("El email debe tener un formato válido");
      }
    }

    if (
      data.rol !== undefined &&
      !["admin", "editor", "visitante"].includes(data.rol)
    ) {
      throw new Error("El rol debe ser admin, editor o visitante");
    }

    return this.usuarioRepository.actualizar(id, data);
  }
}
