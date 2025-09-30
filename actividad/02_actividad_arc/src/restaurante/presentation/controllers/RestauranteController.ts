import { RestauranteService } from "../../application/services/restaurante.service";
import {
  CreateRestauranteDto,
  UpdateRestauranteDto,
  RestauranteResponseDto,
} from "../../application/dtos/restaurante.dto";

export class RestauranteController {
  constructor(private readonly restauranteService: RestauranteService) {}

  // CREATE - mantiene callbacks por requisito
  crearRestaurante(
    data: CreateRestauranteDto
  ): Promise<RestauranteResponseDto> {
    return this.restauranteService.crear(data);
  }

  // UPDATE - Promises
  actualizarRestaurante(
    id: string,
    data: UpdateRestauranteDto
  ): Promise<RestauranteResponseDto> {
    return this.restauranteService.actualizar(id, data);
  }

  // READ - Async/Await
  async obtenerRestaurantePorId(
    id: string
  ): Promise<RestauranteResponseDto | null> {
    return this.restauranteService.obtenerPorId(id);
  }

  async obtenerRestaurantesActivos(): Promise<RestauranteResponseDto[]> {
    return this.restauranteService.listarActivos();
  }

  // DELETE - Async/Await
  async eliminarRestaurante(
    id: string,
    eliminacionFisica: boolean = false
  ): Promise<boolean> {
    return this.restauranteService.eliminar(id, eliminacionFisica);
  }
}
