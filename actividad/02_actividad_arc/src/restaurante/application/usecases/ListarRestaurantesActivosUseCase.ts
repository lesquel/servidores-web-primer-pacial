import { IRestauranteRepository } from "../../domain/repositories/IRestauranteRepository";
import { Restaurante } from "../../domain/entities/Restaurante";

export class ListarRestaurantesActivosUseCase {
  constructor(private readonly restauranteRepository: IRestauranteRepository) {}

  async execute(): Promise<Restaurante[]> {
    return this.restauranteRepository.obtenerTodosActivos();
  }
}
