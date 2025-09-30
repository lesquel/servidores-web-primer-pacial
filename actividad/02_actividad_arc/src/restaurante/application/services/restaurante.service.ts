import { CrearRestauranteUseCase } from "../usecases/CrearRestauranteUseCase";
import { ActualizarRestauranteUseCase } from "../usecases/ActualizarRestauranteUseCase";
import { ObtenerRestaurantePorIdUseCase } from "../usecases/ObtenerRestaurantePorIdUseCase";
import { ListarRestaurantesActivosUseCase } from "../usecases/ListarRestaurantesActivosUseCase";
import { EliminarRestauranteUseCase } from "../usecases/EliminarRestauranteUseCase";
import {
  CreateRestauranteDto,
  UpdateRestauranteDto,
  RestauranteResponseDto,
} from "../dtos/restaurante.dto";
import { RestauranteMapper } from "../mappers/restaurante.mapper";

export class RestauranteService {
  constructor(
    private readonly crearRestaurante: CrearRestauranteUseCase,
    private readonly actualizarRestaurante: ActualizarRestauranteUseCase,
    private readonly obtenerRestaurantePorId: ObtenerRestaurantePorIdUseCase,
    private readonly listarRestaurantesActivos: ListarRestaurantesActivosUseCase,
    private readonly eliminarRestaurante: EliminarRestauranteUseCase
  ) {}

  crear(data: CreateRestauranteDto): Promise<RestauranteResponseDto> {
    return new Promise((resolve, reject) => {
      const props = RestauranteMapper.toCreateProps(data);
      this.crearRestaurante.execute(props, (error, entity) => {
        if (error) return reject(error);
        resolve(RestauranteMapper.toResponseDto(entity!));
      });
    });
  }

  async actualizar(
    id: string,
    data: UpdateRestauranteDto
  ): Promise<RestauranteResponseDto> {
    const props = RestauranteMapper.toUpdateProps(data);
    const entity = await this.actualizarRestaurante.execute(id, props);
    return RestauranteMapper.toResponseDto(entity);
  }

  async obtenerPorId(id: string): Promise<RestauranteResponseDto | null> {
    const entity = await this.obtenerRestaurantePorId.execute(id);
    return entity ? RestauranteMapper.toResponseDto(entity) : null;
  }

  async listarActivos(): Promise<RestauranteResponseDto[]> {
    const entities = await this.listarRestaurantesActivos.execute();
    return entities.map(RestauranteMapper.toResponseDto);
  }

  async eliminar(
    id: string,
    eliminacionFisica: boolean = false
  ): Promise<boolean> {
    return this.eliminarRestaurante.execute(id, eliminacionFisica);
  }
}
