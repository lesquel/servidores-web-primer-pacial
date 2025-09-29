import { IUsuarioRepository } from "../../domain/repositories/IUsuarioRepository";
import { Usuario } from "../../domain/entities/Usuario";

export class ListarUsuariosActivosUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(): Promise<Usuario[]> {
    return this.usuarioRepository.obtenerTodosActivos();
  }
}
