import { IUsuarioRepository } from "../../domain/repositories/IUsuarioRepository";

export class EliminarUsuarioUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(
    id: string,
    eliminacionFisica: boolean = false
  ): Promise<boolean> {
    const existente = await this.usuarioRepository.obtenerPorId(id);
    if (!existente) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    return this.usuarioRepository.eliminar(id, eliminacionFisica);
  }
}
