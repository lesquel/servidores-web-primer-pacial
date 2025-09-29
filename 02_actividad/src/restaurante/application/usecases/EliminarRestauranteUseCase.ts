import { IRestauranteRepository } from "../../domain/repositories/IRestauranteRepository";

export class EliminarRestauranteUseCase {
  constructor(private readonly restauranteRepository: IRestauranteRepository) {}

  async execute(
    id: string,
    eliminacionFisica: boolean = false
  ): Promise<boolean> {
    return this.restauranteRepository.eliminar(id, eliminacionFisica);
  }
}
