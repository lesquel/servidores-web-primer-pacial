import { Controller, Logger } from "@nestjs/common";
import {
  MessagePattern,
  Payload,
  Ctx,
  RmqContext,
} from "@nestjs/microservices";
import { ReservationsService } from "./reservations.service";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { ReservationStatus } from "./entities/reservation.entity";

@Controller()
export class ReservationsController {
  private readonly logger = new Logger(ReservationsController.name);

  constructor(private readonly reservationsService: ReservationsService) {}

  /**
   * ═══════════════════════════════════════════════════════════════════════
   * CREAR RESERVA
   * ═══════════════════════════════════════════════════════════════════════
   *
   * Recibe mensaje del Gateway vía RabbitMQ.
   * Implementa idempotencia con Redis (Opción B del taller).
   */
  @MessagePattern({ cmd: "create_reservation" })
  async createReservation(
    @Payload() data: CreateReservationDto,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log(
      `📥 [ms-reservations] Mensaje recibido: create_reservation`
    );
    this.logger.debug(`   Payload: ${JSON.stringify(data)}`);

    try {
      const result = await this.reservationsService.create(data);

      // ACK manual del mensaje
      channel.ack(originalMsg);

      return result;
    } catch (error) {
      // En caso de error, también hacer ACK para no reencolar infinitamente
      // (el error ya está manejado y respondido)
      channel.ack(originalMsg);
      throw error;
    }
  }

  /**
   * Lista las reservas de un usuario.
   */
  @MessagePattern({ cmd: "list_reservations" })
  async listReservations(@Payload() data: { userId: string }) {
    this.logger.log(
      `📋 [ms-reservations] Listando reservas para: ${data.userId}`
    );
    return this.reservationsService.findByUser(data.userId);
  }

  /**
   * Busca una reserva por ID.
   */
  @MessagePattern({ cmd: "find_reservation" })
  async findReservation(@Payload() data: { id: string; userId: string }) {
    this.logger.log(`🔍 [ms-reservations] Buscando reserva: ${data.id}`);
    return this.reservationsService.findOne(data.id, data.userId);
  }

  /**
   * Actualiza el estado de una reserva.
   */
  @MessagePattern({ cmd: "update_reservation_status" })
  async updateReservationStatus(
    @Payload() data: { id: string; status: ReservationStatus; userId: string }
  ) {
    this.logger.log(
      `🔄 [ms-reservations] Actualizando estado: ${data.id} -> ${data.status}`
    );
    return this.reservationsService.updateStatus(data.id, data.status);
  }
}
