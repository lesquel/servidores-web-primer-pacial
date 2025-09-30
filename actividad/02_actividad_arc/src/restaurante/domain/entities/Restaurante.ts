export interface Restaurante {
  id: string;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  horariosAtencion: string;
  capacidadTotal: number;
  suscripcionId?: string | null;
  imagenId?: string | null;
  eliminado?: boolean | null;
}

// Tipos de dominio para crear y actualizar restaurantes
export type RestauranteCreateProps = {
  nombre: string;
  descripcion: string;
  ubicacion: string;
  horariosAtencion: string;
  capacidadTotal: number;
  suscripcionId?: string | null;
  imagenId?: string | null;
  eliminado?: boolean | null;
};

export type RestauranteUpdateProps = {
  nombre?: string;
  descripcion?: string;
  ubicacion?: string;
  horariosAtencion?: string;
  capacidadTotal?: number;
  suscripcionId?: string | null;
  imagenId?: string | null;
  eliminado?: boolean | null;
};

export class RestauranteEntity {
  public readonly id: string;
  public nombre: string;
  public descripcion: string;
  public ubicacion: string;
  public horariosAtencion: string;
  public capacidadTotal: number;
  public suscripcionId?: string | null;
  public eliminado?: boolean | null;
  public imagenId?: string | null;

  constructor(id: string, props: RestauranteCreateProps) {
    this.id = id;
    this.nombre = props.nombre;
    this.descripcion = props.descripcion;
    this.ubicacion = props.ubicacion;
    this.horariosAtencion = props.horariosAtencion;
    this.capacidadTotal = props.capacidadTotal;
    this.suscripcionId = props.suscripcionId ?? null;
    this.imagenId = props.imagenId ?? null;
    this.eliminado = props.eliminado ?? null;

    this.validar();
  }

  private validar(): void {
    if (!this.id) {
      throw new Error("El ID del restaurante es requerido");
    }

    if (!this.nombre || this.nombre.trim().length === 0) {
      throw new Error("El nombre del restaurante es requerido");
    }

    if (this.nombre.length > 100) {
      throw new Error("El nombre no puede tener más de 100 caracteres");
    }

    if (!this.descripcion || this.descripcion.trim().length === 0) {
      throw new Error("La descripción es requerida");
    }

    if (!this.ubicacion || this.ubicacion.trim().length === 0) {
      throw new Error("La ubicación es requerida");
    }

    if (this.ubicacion.length > 200) {
      throw new Error("La ubicación no puede tener más de 200 caracteres");
    }

    if (!this.horariosAtencion || this.horariosAtencion.trim().length === 0) {
      throw new Error("Los horarios de atención son requeridos");
    }

    if (this.horariosAtencion.length > 100) {
      throw new Error(
        "Los horarios de atención no pueden tener más de 100 caracteres"
      );
    }

    if (
      typeof this.capacidadTotal !== "number" ||
      !Number.isInteger(this.capacidadTotal) ||
      this.capacidadTotal <= 0
    ) {
      throw new Error("La capacidad total debe ser un entero positivo");
    }
  }

  public actualizarNombre(nuevoNombre: string): void {
    if (!nuevoNombre || nuevoNombre.trim().length === 0) {
      throw new Error("El nombre no puede estar vacío");
    }
    if (nuevoNombre.length > 100) {
      throw new Error("El nombre no puede tener más de 100 caracteres");
    }
    this.nombre = nuevoNombre;
  }

  public actualizarDescripcion(nuevaDescripcion: string): void {
    if (!nuevaDescripcion || nuevaDescripcion.trim().length === 0) {
      throw new Error("La descripción no puede estar vacía");
    }
    this.descripcion = nuevaDescripcion;
  }

  public actualizarUbicacion(nuevaUbicacion: string): void {
    if (!nuevaUbicacion || nuevaUbicacion.trim().length === 0) {
      throw new Error("La ubicación no puede estar vacía");
    }
    if (nuevaUbicacion.length > 200) {
      throw new Error("La ubicación no puede tener más de 200 caracteres");
    }
    this.ubicacion = nuevaUbicacion;
  }

  public actualizarHorarios(nuevosHorarios: string): void {
    if (!nuevosHorarios || nuevosHorarios.trim().length === 0) {
      throw new Error("Los horarios no pueden estar vacíos");
    }
    if (nuevosHorarios.length > 100) {
      throw new Error("Los horarios no pueden tener más de 100 caracteres");
    }
    this.horariosAtencion = nuevosHorarios;
  }

  public actualizarCapacidad(nuevaCapacidad: number): void {
    if (
      typeof nuevaCapacidad !== "number" ||
      !Number.isInteger(nuevaCapacidad) ||
      nuevaCapacidad <= 0
    ) {
      throw new Error("La capacidad debe ser un entero positivo");
    }
    this.capacidadTotal = nuevaCapacidad;
  }

  public asignarSuscripcion(suscripcionId: string): void {
    if (!suscripcionId || suscripcionId.trim().length === 0) {
      throw new Error("El id de suscripción no puede estar vacío");
    }
    this.suscripcionId = suscripcionId;
  }

  public quitarSuscripcion(): void {
    this.suscripcionId = null;
  }

  public asignarImagen(imagenId: string): void {
    if (!imagenId || imagenId.trim().length === 0) {
      throw new Error("El id de imagen no puede estar vacío");
    }
    this.imagenId = imagenId;
  }

  public quitarImagen(): void {
    this.imagenId = null;
  }

  public toJSON(): Restaurante {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      ubicacion: this.ubicacion,
      horariosAtencion: this.horariosAtencion,
      capacidadTotal: this.capacidadTotal,
      suscripcionId: this.suscripcionId ?? null,
      imagenId: this.imagenId ?? null,
      eliminado: this.eliminado ?? null,
    };
  }
}
