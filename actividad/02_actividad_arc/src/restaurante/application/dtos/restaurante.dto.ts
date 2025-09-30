// DTOs de la capa de aplicación (no exponen entidades directamente)
export interface CreateRestauranteDto {
  nombre: string;
  descripcion: string;
  ubicacion: string;
  horariosAtencion: string;
  capacidadTotal: number;
  suscripcionId?: string | null;
  imagenId?: string | null;
}

export interface UpdateRestauranteDto {
  nombre?: string;
  descripcion?: string;
  ubicacion?: string;
  horariosAtencion?: string;
  capacidadTotal?: number;
  suscripcionId?: string | null;
  imagenId?: string | null;
  eliminado?: boolean | null;
}

export interface RestauranteResponseDto {
  id: string;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  horariosAtencion: string;
  capacidadTotal: number;
  suscripcionId: string | null;
  imagenId: string | null;
  eliminado: boolean | null;
}
