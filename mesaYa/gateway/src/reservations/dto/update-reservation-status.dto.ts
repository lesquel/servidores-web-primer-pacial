import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsIn } from "class-validator";

export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW"
  | "CHECKED_IN"
  | "REJECTED";

export class UpdateReservationStatusDto {
  @ApiProperty({
    description: "Nuevo estado de la reserva",
    enum: [
      "PENDING",
      "CONFIRMED",
      "CANCELLED",
      "COMPLETED",
      "NO_SHOW",
      "CHECKED_IN",
      "REJECTED",
    ],
    example: "CONFIRMED",
  })
  @IsNotEmpty()
  @IsIn([
    "PENDING",
    "CONFIRMED",
    "CANCELLED",
    "COMPLETED",
    "NO_SHOW",
    "CHECKED_IN",
    "REJECTED",
  ])
  status: ReservationStatus;
}
