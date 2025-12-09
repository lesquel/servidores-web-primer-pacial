import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsUUID,
  IsDateString,
  IsInt,
  Min,
  IsString,
} from "class-validator";

export class CreateReservationDto {
  @ApiProperty({
    description: "Clave de idempotencia única para evitar duplicados",
    example: "reservation-2024-12-09-user123-table456",
  })
  @IsNotEmpty()
  @IsString()
  idempotencyKey: string;

  @ApiProperty({
    description: "ID del restaurante",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsNotEmpty()
  @IsUUID()
  restaurantId: string;

  @ApiProperty({
    description: "ID de la mesa",
    example: "550e8400-e29b-41d4-a716-446655440001",
  })
  @IsNotEmpty()
  @IsUUID()
  tableId: string;

  @ApiProperty({
    description: "Fecha de la reserva (ISO 8601)",
    example: "2024-12-15",
  })
  @IsNotEmpty()
  @IsDateString()
  reservationDate: string;

  @ApiProperty({
    description: "Hora de la reserva (ISO 8601)",
    example: "2024-12-15T19:00:00Z",
  })
  @IsNotEmpty()
  @IsDateString()
  reservationTime: string;

  @ApiProperty({
    description: "Número de comensales",
    example: 4,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  numberOfGuests: number;
}
