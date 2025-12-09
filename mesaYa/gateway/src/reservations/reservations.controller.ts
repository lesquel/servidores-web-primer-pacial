import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseGuards,
  Inject,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from "@nestjs/swagger";
import { firstValueFrom, timeout, catchError, throwError } from "rxjs";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { ValidatedUser } from "../auth/strategies/jwt.strategy";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationStatusDto } from "./dto/update-reservation-status.dto";

@ApiTags("Reservations")
@Controller("reservations")
export class ReservationsController {
  private readonly logger = new Logger(ReservationsController.name);

  constructor(
    @Inject("RESERVATIONS_SERVICE")
    private readonly reservationsClient: ClientProxy
  ) {}

  /**
   * ═══════════════════════════════════════════════════════════════════════
   * POST /api/v1/reservations
   * ═══════════════════════════════════════════════════════════════════════
   *
   * Crea una nueva reserva con idempotencia.
   *
   * Flujo:
   * 1. Gateway valida JWT y extrae userId
   * 2. Gateway envía mensaje a ms-reservations vía RabbitMQ
   * 3. ms-reservations verifica idempotencyKey en Redis
   * 4. Si es duplicado → retorna 409
   * 5. Si es nuevo → guarda en Postgres, confirma en Redis, emite evento a ms-tables
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Crear una nueva reserva",
    description:
      "Crea una reserva con verificación de idempotencia. Requiere idempotencyKey único.",
  })
  @ApiResponse({ status: 201, description: "Reserva creada exitosamente" })
  @ApiResponse({
    status: 401,
    description: "No autorizado - Token JWT inválido o faltante",
  })
  @ApiResponse({
    status: 409,
    description: "Conflicto - idempotencyKey ya fue procesada",
  })
  @ApiResponse({ status: 500, description: "Error interno del servidor" })
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() user: ValidatedUser
  ) {
    const startTime = Date.now();

    // Log de entrada
    this.logger.log(`📨 [Gateway] Nueva solicitud de reserva`);
    this.logger.log(`   Usuario: ${user.userId}`);
    this.logger.log(
      `   IdempotencyKey: ${createReservationDto.idempotencyKey}`
    );

    // Construir payload con el userId validado del JWT
    const payload = {
      ...createReservationDto,
      userId: user.userId,
    };

    try {
      // Enviar mensaje al microservicio de reservas y esperar respuesta
      const result = await firstValueFrom(
        this.reservationsClient
          .send({ cmd: "create_reservation" }, payload)
          .pipe(
            timeout(15000), // 15 segundos de timeout
            catchError((err) => {
              this.logger.error(`❌ [Gateway] Error del microservicio:`, err);
              return throwError(() => err);
            })
          )
      );

      const duration = Date.now() - startTime;
      this.logger.log(`✅ [Gateway] Reserva creada en ${duration}ms`);
      this.logger.log(`   ReservationId: ${result.id}`);

      return {
        success: true,
        data: result,
        meta: {
          processingTime: `${duration}ms`,
          idempotencyKey: createReservationDto.idempotencyKey,
        },
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;

      // Extraer información del error RPC
      // El error puede venir como objeto directamente o como string JSON
      let errorData: any;
      if (typeof error === "object" && error !== null) {
        // El error viene como objeto (RpcException)
        errorData = error;
      } else if (typeof error?.message === "string") {
        try {
          errorData = JSON.parse(error.message);
        } catch {
          errorData = { message: error.message };
        }
      }

      // Manejar errores de duplicado (idempotencia)
      if (
        errorData?.status === 409 ||
        errorData?.message?.includes("Duplicate")
      ) {
        this.logger.warn(`⚠️ [Gateway] Duplicado detectado en ${duration}ms`);
        this.logger.warn(
          `   IdempotencyKey: ${createReservationDto.idempotencyKey}`
        );

        throw new HttpException(
          {
            success: false,
            statusCode: HttpStatus.CONFLICT,
            message: "Reservation with this idempotencyKey already exists",
            error: "DUPLICATE_IDEMPOTENCY_KEY",
            idempotencyKey: createReservationDto.idempotencyKey,
            existingReservationId: errorData?.existingReservationId,
            meta: {
              processingTime: `${duration}ms`,
            },
          },
          HttpStatus.CONFLICT
        );
      }

      this.logger.error(`❌ [Gateway] Error en ${duration}ms:`, error?.message);

      throw new HttpException(
        {
          success: false,
          statusCode: errorData?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          message:
            errorData?.message ||
            error?.message ||
            "Error creating reservation",
          meta: {
            processingTime: `${duration}ms`,
          },
        },
        errorData?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * GET /api/v1/reservations
   * Lista las reservas del usuario autenticado.
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Listar mis reservas" })
  async findAll(@CurrentUser() user: ValidatedUser) {
    this.logger.log(
      `📋 [Gateway] Listando reservas para usuario: ${user.userId}`
    );

    try {
      const result = await firstValueFrom(
        this.reservationsClient
          .send({ cmd: "list_reservations" }, { userId: user.userId })
          .pipe(timeout(10000))
      );
      return { success: true, data: result };
    } catch (error: any) {
      throw new HttpException(
        {
          success: false,
          message: error?.message || "Error fetching reservations",
        },
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * GET /api/v1/reservations/:id
   * Obtiene una reserva por ID.
   */
  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Obtener detalle de una reserva" })
  async findOne(@Param("id") id: string, @CurrentUser() user: ValidatedUser) {
    this.logger.log(`🔍 [Gateway] Buscando reserva: ${id}`);

    try {
      const result = await firstValueFrom(
        this.reservationsClient
          .send({ cmd: "find_reservation" }, { id, userId: user.userId })
          .pipe(timeout(10000))
      );
      return { success: true, data: result };
    } catch (error: any) {
      throw new HttpException(
        {
          success: false,
          message: error?.message || "Reservation not found",
        },
        error?.status || HttpStatus.NOT_FOUND
      );
    }
  }

  /**
   * PATCH /api/v1/reservations/:id/status
   * Actualiza el estado de una reserva.
   */
  @Patch(":id/status")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Actualizar estado de una reserva" })
  @ApiBody({ type: UpdateReservationStatusDto })
  async updateStatus(
    @Param("id") id: string,
    @Body() updateStatusDto: UpdateReservationStatusDto,
    @CurrentUser() user: ValidatedUser
  ) {
    this.logger.log(
      `🔄 [Gateway] Actualizando estado de reserva: ${id} -> ${updateStatusDto.status}`
    );

    try {
      const result = await firstValueFrom(
        this.reservationsClient
          .send(
            { cmd: "update_reservation_status" },
            {
              id,
              status: updateStatusDto.status,
              userId: user.userId,
            }
          )
          .pipe(timeout(10000))
      );
      return { success: true, data: result };
    } catch (error: any) {
      throw new HttpException(
        {
          success: false,
          message: error?.message || "Error updating reservation status",
        },
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
