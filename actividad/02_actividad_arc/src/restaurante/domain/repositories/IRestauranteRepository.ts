import { Restaurante } from "../entities/Restaurante";

export interface RestauranteCreate {
  nombre: string;
  descripcion: string;
  ubicacion: string;
  horariosAtencion: string;
  capacidadTotal: number;
  suscripcionId?: string | null;
  imagenId?: string | null;
  eliminado?: boolean | null;
}

export interface RestauranteUpdate {
  nombre?: string;
  descripcion?: string;
  ubicacion?: string;
  horariosAtencion?: string;
  capacidadTotal?: number;
  suscripcionId?: string | null;
  imagenId?: string | null;
  eliminado?: boolean | null;
}

export interface IRestauranteRepository {
  // CREATE - Usando Callbacks (error, resultado)
  crear(
    data: RestauranteCreate,
    callback: (error: Error | null, resultado: Restaurante | null) => void
  ): void;

  // UPDATE - Retornando Promise<Usuario>
  actualizar(id: string, data: RestauranteUpdate): Promise<Restaurante>;

  // READ - Async functions retornando Promise
  obtenerPorId(id: string): Promise<Restaurante | null>;
  obtenerTodosActivos(): Promise<Restaurante[]>;

  // DELETE - Async function retornando Promise<boolean>
  eliminar(id: string, eliminacionFisica?: boolean): Promise<boolean>;
}
