import { UsuarioRepositoryInMemory } from "../infrastructure/repositories/UsuarioRepositoryInMemory";
import { UsuarioController } from "../presentation/controllers/UsuarioController";
import { CrearUsuarioUseCase } from "../application/usecases/CrearUsuarioUseCase";
import { ActualizarUsuarioUseCase } from "../application/usecases/ActualizarUsuarioUseCase";
import { ObtenerUsuarioPorIdUseCase } from "../application/usecases/ObtenerUsuarioPorIdUseCase";
import { ListarUsuariosActivosUseCase } from "../application/usecases/ListarUsuariosActivosUseCase";
import { EliminarUsuarioUseCase } from "../application/usecases/EliminarUsuarioUseCase";

export class UserContainer {
  private static instance: UserContainer;
  private readonly usuarioRepository: UsuarioRepositoryInMemory;
  private readonly usuarioController: UsuarioController;
  private readonly crearUsuarioUseCase: CrearUsuarioUseCase;
  private readonly actualizarUsuarioUseCase: ActualizarUsuarioUseCase;
  private readonly obtenerUsuarioPorIdUseCase: ObtenerUsuarioPorIdUseCase;
  private readonly listarUsuariosActivosUseCase: ListarUsuariosActivosUseCase;
  private readonly eliminarUsuarioUseCase: EliminarUsuarioUseCase;

  private constructor() {
    // Infrastructure Layer
    this.usuarioRepository = new UsuarioRepositoryInMemory();

    // Application Layer - Use cases
    this.crearUsuarioUseCase = new CrearUsuarioUseCase(this.usuarioRepository);
    this.actualizarUsuarioUseCase = new ActualizarUsuarioUseCase(
      this.usuarioRepository
    );
    this.obtenerUsuarioPorIdUseCase = new ObtenerUsuarioPorIdUseCase(
      this.usuarioRepository
    );
    this.listarUsuariosActivosUseCase = new ListarUsuariosActivosUseCase(
      this.usuarioRepository
    );
    this.eliminarUsuarioUseCase = new EliminarUsuarioUseCase(
      this.usuarioRepository
    );

    // Presentation Layer
    this.usuarioController = new UsuarioController(
      this.crearUsuarioUseCase,
      this.actualizarUsuarioUseCase,
      this.obtenerUsuarioPorIdUseCase,
      this.listarUsuariosActivosUseCase,
      this.eliminarUsuarioUseCase
    );
  }

  public static getInstance(): UserContainer {
    if (!UserContainer.instance) {
      UserContainer.instance = new UserContainer();
    }
    return UserContainer.instance;
  }

  // Getters para acceder a las instancias
  public getUsuarioRepository(): UsuarioRepositoryInMemory {
    return this.usuarioRepository;
  }

  public getUsuarioController(): UsuarioController {
    return this.usuarioController;
  }
}
