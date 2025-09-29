import { IUsuarioRepository } from "../../domain/repositories/IUsuarioRepository";
import { Usuario } from "../../domain/entities/Usuario";

export class ObtenerUsuarioPorIdUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(id: string): Promise<Usuario | null> {
    return this.usuarioRepository.obtenerPorId(id);
  }
}
