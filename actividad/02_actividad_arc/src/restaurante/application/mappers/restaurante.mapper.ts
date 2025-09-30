import {
  Restaurante,
  RestauranteCreateProps,
  RestauranteUpdateProps,
} from "../../domain/entities/Restaurante";
import {
  CreateRestauranteDto,
  UpdateRestauranteDto,
  RestauranteResponseDto,
} from "../dtos/restaurante.dto";

export const RestauranteMapper = {
  toCreateProps(dto: CreateRestauranteDto): RestauranteCreateProps {
    return {
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      ubicacion: dto.ubicacion,
      horariosAtencion: dto.horariosAtencion,
      capacidadTotal: dto.capacidadTotal,
      suscripcionId: dto.suscripcionId ?? null,
      imagenId: dto.imagenId ?? null,
    };
  },

  toUpdateProps(dto: UpdateRestauranteDto): RestauranteUpdateProps {
    const props: RestauranteUpdateProps = {};
    if (dto.nombre !== undefined) props.nombre = dto.nombre;
    if (dto.descripcion !== undefined) props.descripcion = dto.descripcion;
    if (dto.ubicacion !== undefined) props.ubicacion = dto.ubicacion;
    if (dto.horariosAtencion !== undefined)
      props.horariosAtencion = dto.horariosAtencion;
    if (dto.capacidadTotal !== undefined)
      props.capacidadTotal = dto.capacidadTotal;
    if (dto.suscripcionId !== undefined)
      props.suscripcionId = dto.suscripcionId;
    if (dto.imagenId !== undefined) props.imagenId = dto.imagenId;
    if (dto.eliminado !== undefined) props.eliminado = dto.eliminado;
    return props;
  },

  toResponseDto(entity: Restaurante): RestauranteResponseDto {
    return {
      id: entity.id,
      nombre: entity.nombre,
      descripcion: entity.descripcion,
      ubicacion: entity.ubicacion,
      horariosAtencion: entity.horariosAtencion,
      capacidadTotal: entity.capacidadTotal,
      suscripcionId: entity.suscripcionId ?? null,
      imagenId: entity.imagenId ?? null,
      eliminado: entity.eliminado ?? null,
    };
  },
};
