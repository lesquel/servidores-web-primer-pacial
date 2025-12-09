import {
  IsNotEmpty,
  IsUUID,
  IsDateString,
  IsInt,
  Min,
  IsString,
} from "class-validator";

export class CreateReservationDto {
  @IsNotEmpty()
  @IsString()
  idempotencyKey: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  restaurantId: string;

  @IsNotEmpty()
  @IsUUID()
  tableId: string;

  @IsNotEmpty()
  @IsDateString()
  reservationDate: string;

  @IsNotEmpty()
  @IsDateString()
  reservationTime: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  numberOfGuests: number;
}
