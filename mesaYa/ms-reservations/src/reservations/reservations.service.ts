import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import {
  ReservationEntity,
  ReservationStatus,
} from "./entities/reservation.entity";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { RedisService } from "../redis/redis.service";

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
    @Inject("TABLES_SERVICE") private readonly tablesClient: ClientProxy,
    private readonly redisService: RedisService
  ) {}

  /**
   * ═══════════════════════════════════════════════════════════════════════
   * CREAR RESERVA CON IDEMPOTENCIA AVANZADA
   * ═══════════════════════════════════════════════════════════════════════
   *
   * Implementa el Patrón de Consumidor Idempotente (Opción B del taller):
   *
   * 1. Check-Lock-Check con Redis (evita race conditions)
   * 2. Guardar en Postgres
   * 3. Confirmar idempotency key en Redis
   * 4. Emitir evento a ms-tables
   *
   * En caso de error, se hace rollback del lock.
   */
  async create(dto: CreateReservationDto): Promise<ReservationEntity> {
    const {
      idempotencyKey,
      userId,
      restaurantId,
      tableId,
      reservationDate,
      reservationTime,
      numberOfGuests,
    } = dto;

    console.log(`\n${"═".repeat(60)}`);
    console.log(`📨 Nueva solicitud de reserva`);
    console.log(`   IdempotencyKey: ${idempotencyKey}`);
    console.log(`   Usuario: ${userId}`);
    console.log(`   Mesa: ${tableId}`);
    console.log(`${"═".repeat(60)}\n`);

    // ─────────────────────────────────────────────────────────────
    // PASO 1: Verificar idempotencia con Lock Distribuido
    // ─────────────────────────────────────────────────────────────
    const idempotencyResult = await this.redisService.checkAndLock(
      idempotencyKey
    );

    if (idempotencyResult.isDuplicate) {
      console.log(`⚠️ DUPLICADO DETECTADO`);
      console.log(`   IdempotencyKey: ${idempotencyKey}`);
      console.log(
        `   ReservationId existente: ${idempotencyResult.existingReservationId}`
      );

      // Lanzar excepción RPC para que el Gateway la maneje
      throw new RpcException({
        status: 409,
        message: "Duplicate reservation: idempotencyKey already processed",
        idempotencyKey,
        existingReservationId: idempotencyResult.existingReservationId,
      });
    }

    // Lock adquirido, proceder con la creación
    console.log(`🔐 Lock adquirido, procediendo con la creación...`);

    let savedReservation: ReservationEntity;

    try {
      // ─────────────────────────────────────────────────────────────
      // PASO 2: Crear reserva en Postgres
      // ─────────────────────────────────────────────────────────────
      const reservation = this.reservationRepository.create({
        userId,
        restaurantId,
        tableId, // Solo es un string UUID, no una FK real
        reservationDate: new Date(reservationDate),
        reservationTime: new Date(reservationTime),
        numberOfGuests,
        status: "PENDING",
      });

      savedReservation = await this.reservationRepository.save(reservation);
      console.log(`✅ Reserva guardada en Postgres: ${savedReservation.id}`);

      // ─────────────────────────────────────────────────────────────
      // PASO 3: Confirmar idempotency key en Redis
      // ─────────────────────────────────────────────────────────────
      await this.redisService.confirmReservation(
        idempotencyKey,
        savedReservation.id
      );
    } catch (error) {
      // ─────────────────────────────────────────────────────────────
      // ROLLBACK: Liberar lock en caso de error
      // ─────────────────────────────────────────────────────────────
      console.error(`❌ Error al crear reserva, haciendo rollback del lock`);
      await this.redisService.rollbackLock(idempotencyKey);

      throw new RpcException({
        status: 500,
        message: "Error creating reservation",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    // ─────────────────────────────────────────────────────────────
    // PASO 4: Emitir evento a ms-tables (fire and forget)
    // ─────────────────────────────────────────────────────────────
    try {
      this.tablesClient.emit("table.occupied", {
        tableId,
        reservationId: savedReservation.id,
        userId,
        timestamp: new Date().toISOString(),
      });
      console.log(`📤 Evento 'table.occupied' emitido para mesa ${tableId}`);
    } catch (eventError) {
      // El evento es best-effort, no debe fallar la reserva
      console.warn(`⚠️ Error emitiendo evento (no crítico):`, eventError);
    }

    console.log(`\n${"─".repeat(60)}`);
    console.log(`🎉 RESERVA COMPLETADA EXITOSAMENTE`);
    console.log(`   ID: ${savedReservation.id}`);
    console.log(`   IdempotencyKey: ${idempotencyKey}`);
    console.log(`${"─".repeat(60)}\n`);

    return savedReservation;
  }

  async findByUser(userId: string): Promise<ReservationEntity[]> {
    return this.reservationRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: string, userId: string): Promise<ReservationEntity> {
    const reservation = await this.reservationRepository.findOne({
      where: { id, userId },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    return reservation;
  }

  async updateStatus(
    id: string,
    status: ReservationStatus
  ): Promise<ReservationEntity> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    reservation.status = status;
    const updated = await this.reservationRepository.save(reservation);

    // Si la reserva se completa o cancela, liberar la mesa
    if (status === "COMPLETED" || status === "CANCELLED") {
      this.tablesClient.emit("table.released", {
        tableId: reservation.tableId,
      });
      console.log(
        `📤 Evento table.released emitido para mesa ${reservation.tableId}`
      );
    }

    return updated;
  }
}
