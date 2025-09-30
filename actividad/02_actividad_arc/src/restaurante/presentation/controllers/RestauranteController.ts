import { Restaurante } from "../../domain/entities/Restaurante";
import {
  RestauranteCreate,
  RestauranteUpdate,
} from "../../domain/repositories/IRestauranteRepository";
import { CrearRestauranteUseCase } from "../../application/usecases/CrearRestauranteUseCase";
import { ActualizarRestauranteUseCase } from "../../application/usecases/ActualizarRestauranteUseCase";
import { ObtenerRestaurantePorIdUseCase } from "../../application/usecases/ObtenerRestaurantePorIdUseCase";
import { ListarRestaurantesActivosUseCase } from "../../application/usecases/ListarRestaurantesActivosUseCase";
import { EliminarRestauranteUseCase } from "../../application/usecases/EliminarRestauranteUseCase";

export class RestauranteController {
  constructor(
    private readonly crearRestauranteUseCase: CrearRestauranteUseCase,
    private readonly actualizarRestauranteUseCase: ActualizarRestauranteUseCase,
    private readonly obtenerRestaurantePorIdUseCase: ObtenerRestaurantePorIdUseCase,
    private readonly listarRestaurantesActivosUseCase: ListarRestaurantesActivosUseCase,
    private readonly eliminarRestauranteUseCase: EliminarRestauranteUseCase
  ) {}

  // CREATE - mantiene callbacks por requisito
  crearRestaurante(data: RestauranteCreate): Promise<Restaurante> {
    return new Promise((resolve, reject) => {
      this.crearRestauranteUseCase.execute(data, (error, resultado) => {
        if (error) return reject(error);
        resolve(resultado as Restaurante);
      });
    });
  }

  // UPDATE - Promises
  actualizarRestaurante(
    id: string,
    data: RestauranteUpdate
  ): Promise<Restaurante> {
    return this.actualizarRestauranteUseCase.execute(id, data);
  }

  // READ - Async/Await
  async obtenerRestaurantePorId(id: string): Promise<Restaurante | null> {
    return this.obtenerRestaurantePorIdUseCase.execute(id);
  }

  async obtenerRestaurantesActivos(): Promise<Restaurante[]> {
    return this.listarRestaurantesActivosUseCase.execute();
  }

  // DELETE - Async/Await
  async eliminarRestaurante(
    id: string,
    eliminacionFisica: boolean = false
  ): Promise<boolean> {
    return this.eliminarRestauranteUseCase.execute(id, eliminacionFisica);
  }
}
