import { v7 as uuid } from "uuid";
import { Restaurante } from "../../domain/entities/Restaurante";
import {
  IRestauranteRepository,
  RestauranteCreate,
  RestauranteUpdate,
} from "../../domain/repositories/IRestauranteRepository";

export class RestauranteRepositoryInMemory implements IRestauranteRepository {
  private readonly restaurantes: Map<string, Restaurante> = new Map();

  constructor() {
    this.inicializarDatosDePrueba();
  }

  private inicializarDatosDePrueba(): void {
    const restaurantesDePrueba: Restaurante[] = [
      {
        id: uuid(),
        nombre: "Restaurante 1",
        descripcion: "La mejor restaurante del mundo",
        ubicacion: "Calle 123, 123",
        horariosAtencion: "Lunes a Viernes de 9:00 a 20:00",
        capacidadTotal: 100,
        suscripcionId: null,
        imagenId: null,
      },
    ];
    restaurantesDePrueba.forEach((restaurante) => {
      this.restaurantes.set(restaurante.id, restaurante);
    });
  }

  private generarId(): string {
    return uuid();
  }

  // CREATE - Usando Callbacks
  crear(
    data: RestauranteCreate,
    callback: (error: Error | null, resultado: Restaurante | null) => void
  ): void {
    try {
      const id = this.generarId();
      const restaurante: Restaurante = {
        id,
        nombre: data.nombre,
        descripcion: data.descripcion,
        ubicacion: data.ubicacion,
        horariosAtencion: data.horariosAtencion,
        capacidadTotal: data.capacidadTotal,
        suscripcionId: data.suscripcionId ?? null,
        imagenId: data.imagenId ?? null,
      };

      this.restaurantes.set(id, restaurante);
      callback(null, restaurante);
    } catch (error) {
      callback(error as Error, null);
    }
  }

  actualizar(id: string, data: RestauranteUpdate): Promise<Restaurante> {
    const restauranteExistente = this.restaurantes.get(id);
    if (!restauranteExistente) {
      throw new Error(`Restaurante con ID ${id} no encontrado`);
    }

    const restauranteActualizado: Restaurante = {
      ...restauranteExistente,
      ...data,
    };

    this.restaurantes.set(id, restauranteActualizado);
    return Promise.resolve(restauranteActualizado);
  }

  obtenerPorId(id: string): Promise<Restaurante | null> {
    return Promise.resolve(this.restaurantes.get(id) || null);
  }

  obtenerTodosActivos(): Promise<Restaurante[]> {
    return Promise.resolve(
      Array.from(this.restaurantes.values()).filter(
        (restaurante) => !restaurante.eliminado
      )
    );
  }

  eliminar(id: string, eliminacionFisica: boolean = false): Promise<boolean> {
    const restaurante = this.restaurantes.get(id);
    if (!restaurante) {
      return Promise.resolve(false);
    }

    if (eliminacionFisica) {
      // Eliminación física
      this.restaurantes.delete(id);
    } else {
      // Eliminación lógica
      restaurante.eliminado = true;
      this.restaurantes.set(id, restaurante);
    }

    return Promise.resolve(true);
  }
}
