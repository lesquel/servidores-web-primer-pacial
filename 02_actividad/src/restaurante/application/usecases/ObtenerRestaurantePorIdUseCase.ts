import { IRestauranteRepository } from "../../domain/repositories/IRestauranteRepository";
import { Restaurante } from "../../domain/entities/Restaurante";

export class ObtenerRestaurantePorIdUseCase {
  constructor(private readonly restauranteRepository: IRestauranteRepository) {}

  async execute(id: string): Promise<Restaurante | null> {
    return this.restauranteRepository.obtenerPorId(id);
  }
}
