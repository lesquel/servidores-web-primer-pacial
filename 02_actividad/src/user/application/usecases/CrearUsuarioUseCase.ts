import {
  IUsuarioRepository,
  UsuarioCreate,
} from "../../domain/repositories/IUsuarioRepository";

export class CrearUsuarioUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  // Callbacks: (error, resultado) con simulación de latencia
  execute(
    data: UsuarioCreate,
    callback: (error: Error | null, resultado: any | null) => void
  ): void {
    try {
      if (!data.nombre || data.nombre.trim().length === 0) {
        callback(new Error("El nombre es requerido"), null);
        return;
      }

      if (!data.email) {
        callback(new Error("El email es requerido"), null);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        callback(new Error("El email debe tener un formato válido"), null);
        return;
      }

      if (!["admin", "editor", "visitante"].includes(data.rol)) {
        callback(new Error("El rol debe ser admin, editor o visitante"), null);
        return;
      }

      // Simular latencia de red
      setTimeout(() => {
        this.usuarioRepository.crear(
          { nombre: data.nombre, email: data.email, rol: data.rol },
          callback
        );
      }, 100);
    } catch (error) {
      callback(error as Error, null);
    }
  }
}
