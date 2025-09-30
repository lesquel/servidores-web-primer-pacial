import { IRestauranteRepository } from "../../domain/repositories/IRestauranteRepository";
import {
  RestauranteCreateProps,
  Restaurante,
} from "../../domain/entities/Restaurante";

export class CrearRestauranteUseCase {
  constructor(private readonly restauranteRepository: IRestauranteRepository) {}

  execute(
    data: RestauranteCreateProps,
    callback: (error: Error | null, resultado: Restaurante | null) => void
  ): void {
    try {
      if (!data.nombre || data.nombre.trim().length === 0) {
        callback(new Error("El nombre es requerido"), null);
        return;
      }

      if (!data.descripcion || data.descripcion.trim().length === 0) {
        callback(new Error("La descripción es requerida"), null);
        return;
      }

      if (!data.ubicacion || data.ubicacion.trim().length === 0) {
        callback(new Error("La ubicación es requerida"), null);
        return;
      }

      if (!data.horariosAtencion || data.horariosAtencion.trim().length === 0) {
        callback(new Error("Los horarios de atención son requeridos"), null);
        return;
      }

      if (
        typeof data.capacidadTotal !== "number" ||
        !Number.isInteger(data.capacidadTotal) ||
        data.capacidadTotal <= 0
      ) {
        callback(
          new Error("La capacidad total debe ser un entero positivo"),
          null
        );
        return;
      }

      // Simular latencia
      setTimeout(() => {
        this.restauranteRepository.crear(data, callback);
      }, 100);
    } catch (error) {
      callback(error as Error, null);
    }
  }
}
