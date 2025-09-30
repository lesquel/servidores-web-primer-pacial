import { IRestauranteRepository } from "../../domain/repositories/IRestauranteRepository";
import {
  Restaurante,
  RestauranteUpdateProps,
} from "../../domain/entities/Restaurante";

export class ActualizarRestauranteUseCase {
  constructor(private readonly restauranteRepository: IRestauranteRepository) {}

  async execute(
    id: string,
    data: RestauranteUpdateProps
  ): Promise<Restaurante> {
    // Validaciones parciales (opcionales)
    if (data.nombre !== undefined && data.nombre.trim().length === 0) {
      throw new Error("El nombre no puede estar vacío");
    }
    if (data.ubicacion !== undefined && data.ubicacion.trim().length === 0) {
      throw new Error("La ubicación no puede estar vacía");
    }
    if (
      data.capacidadTotal !== undefined &&
      (!Number.isInteger(data.capacidadTotal) || data.capacidadTotal <= 0)
    ) {
      throw new Error("La capacidad total debe ser un entero positivo");
    }
    return this.restauranteRepository.actualizar(id, data);
  }
}
