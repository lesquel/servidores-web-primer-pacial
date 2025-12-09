import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW"
  | "CHECKED_IN"
  | "REJECTED";

@Entity("reservations")
export class ReservationEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /**
   * ID del usuario (referencia externa, no FK real).
   * El userId llega validado desde el Gateway.
   */
  @Column({ type: "uuid" })
  userId: string;

  /**
   * ID del restaurante (referencia externa).
   */
  @Column({ type: "uuid" })
  restaurantId: string;

  /**
   * ID de la mesa (referencia externa, no FK real).
   * En este microservicio no existe relación TypeORM con Table,
   * ya que las mesas están en ms-tables con su propia BD.
   */
  @Column({ type: "uuid" })
  tableId: string;

  @Column({ type: "timestamp" })
  reservationDate: Date;

  @Column({ type: "timestamp" })
  reservationTime: Date;

  @Column({ type: "int" })
  numberOfGuests: number;

  @Column({
    type: "varchar",
    length: 20,
    default: "PENDING",
  })
  status: ReservationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
