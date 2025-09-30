import {
  Restaurante,
  RestauranteCreateProps,
  RestauranteUpdateProps,
} from "../entities/Restaurante";

export interface IRestauranteRepository {
  // CREATE - Usando Callbacks (error, resultado)
  crear(
    data: RestauranteCreateProps,
    callback: (error: Error | null, resultado: Restaurante | null) => void
  ): void;

  // UPDATE - Retornando Promise<Usuario>
  actualizar(id: string, data: RestauranteUpdateProps): Promise<Restaurante>;

  // READ - Async functions retornando Promise
  obtenerPorId(id: string): Promise<Restaurante | null>;
  obtenerTodosActivos(): Promise<Restaurante[]>;

  // DELETE - Async function retornando Promise<boolean>
  eliminar(id: string, eliminacionFisica?: boolean): Promise<boolean>;
}
