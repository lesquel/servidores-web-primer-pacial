import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export type TableStatus = "AVAILABLE" | "OCCUPIED" | "BLOCKED";

@Entity("tables")
export class TableEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /**
   * ID de la sección (referencia externa, no FK real).
   * En este microservicio no existe relación TypeORM con Section,
   * ya que las secciones podrían estar en otro servicio o simplemente
   * se almacena como referencia.
   */
  @Column({ type: "uuid" })
  sectionId: string;

  @Column({ type: "int" })
  number: number;

  @Column({ type: "int" })
  capacity: number;

  @Column({ type: "int", default: 0 })
  posX: number;

  @Column({ type: "int", default: 0 })
  posY: number;

  @Column({ type: "int", default: 100 })
  width: number;

  @Column({ type: "int", default: 100 })
  height: number;

  @Column({ type: "uuid", nullable: true })
  tableImageId: string;

  @Column({ type: "uuid", nullable: true })
  chairImageId: string;

  @Column({
    type: "varchar",
    length: 20,
    default: "AVAILABLE",
  })
  status: TableStatus;

  @Column({ type: "boolean", default: true })
  isAvailable: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
