import { RestauranteRepositoryInMemory } from "../infrastructure/repositories/RestauranteRepositoryInMemory";
import { RestauranteController } from "../presentation/controllers/RestauranteController";
import { CrearRestauranteUseCase } from "../application/usecases/CrearRestauranteUseCase";
import { ActualizarRestauranteUseCase } from "../application/usecases/ActualizarRestauranteUseCase";
import { ObtenerRestaurantePorIdUseCase } from "../application/usecases/ObtenerRestaurantePorIdUseCase";
import { ListarRestaurantesActivosUseCase } from "../application/usecases/ListarRestaurantesActivosUseCase";
import { EliminarRestauranteUseCase } from "../application/usecases/EliminarRestauranteUseCase";
import { RestauranteService } from "../application/services/restaurante.service";

export class RestauranteContainer {
  private static instance: RestauranteContainer;
  private readonly restauranteRepository: RestauranteRepositoryInMemory;
  private readonly restauranteController: RestauranteController;
  private readonly restauranteService: RestauranteService;
  private readonly crearRestauranteUseCase: CrearRestauranteUseCase;
  private readonly actualizarRestauranteUseCase: ActualizarRestauranteUseCase;
  private readonly obtenerRestaurantePorIdUseCase: ObtenerRestaurantePorIdUseCase;
  private readonly listarRestaurantesActivosUseCase: ListarRestaurantesActivosUseCase;
  private readonly eliminarRestauranteUseCase: EliminarRestauranteUseCase;

  private constructor() {
    // Infrastructure
    this.restauranteRepository = new RestauranteRepositoryInMemory();

    // Application - Use cases
    this.crearRestauranteUseCase = new CrearRestauranteUseCase(
      this.restauranteRepository
    );
    this.actualizarRestauranteUseCase = new ActualizarRestauranteUseCase(
      this.restauranteRepository
    );
    this.obtenerRestaurantePorIdUseCase = new ObtenerRestaurantePorIdUseCase(
      this.restauranteRepository
    );
    this.listarRestaurantesActivosUseCase =
      new ListarRestaurantesActivosUseCase(this.restauranteRepository);
    this.eliminarRestauranteUseCase = new EliminarRestauranteUseCase(
      this.restauranteRepository
    );

    // Application Service
    this.restauranteService = new RestauranteService(
      this.crearRestauranteUseCase,
      this.actualizarRestauranteUseCase,
      this.obtenerRestaurantePorIdUseCase,
      this.listarRestaurantesActivosUseCase,
      this.eliminarRestauranteUseCase
    );

    // Presentation (usa el service)
    this.restauranteController = new RestauranteController(
      this.restauranteService
    );
  }

  public static getInstance(): RestauranteContainer {
    if (!RestauranteContainer.instance) {
      RestauranteContainer.instance = new RestauranteContainer();
    }
    return RestauranteContainer.instance;
  }

  public getRestauranteRepository(): RestauranteRepositoryInMemory {
    return this.restauranteRepository;
  }

  public getRestauranteController(): RestauranteController {
    return this.restauranteController;
  }

  public getRestauranteService(): RestauranteService {
    return this.restauranteService;
  }
}
