import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

export interface IdempotencyResult {
  isDuplicate: boolean;
  existingReservationId?: string;
  lockAcquired?: boolean;
}

@Injectable()
export class RedisService {
  private readonly ttlSeconds: number;
  private readonly lockTtlMs: number = 5000; // 5 segundos para el lock
  private readonly redis: Redis;

  constructor(private readonly config: ConfigService) {
    this.ttlSeconds =
      this.config.get<number>("IDEMPOTENCY_TTL_SECONDS") || 86400; // 24h default

    this.redis = new Redis({
      host: this.config.get<string>("REDIS_HOST") || "localhost",
      port: this.config.get<number>("REDIS_PORT") || 6379,
    });

    this.redis.on("connect", () => {
      console.log("✅ Redis connected");
    });

    this.redis.on("error", (err) => {
      console.error("❌ Redis error:", err);
    });
  }

  /**
   * ═══════════════════════════════════════════════════════════════════════
   * IDEMPOTENCIA AVANZADA CON DISTRIBUTED LOCK
   * ═══════════════════════════════════════════════════════════════════════
   *
   * Implementa el patrón "Check-Lock-Check" para evitar race conditions:
   * 1. Primera verificación rápida (sin lock)
   * 2. Adquirir lock distribuido
   * 3. Segunda verificación (con lock)
   * 4. Procesar si es único
   * 5. Liberar lock
   */

  /**
   * Verifica idempotencia y adquiere lock atómicamente.
   * Usa SET NX EX para garantizar atomicidad.
   *
   * @returns { isDuplicate, existingReservationId, lockAcquired }
   */
  async checkAndLock(key: string): Promise<IdempotencyResult> {
    const idempotencyKey = `reservation_key:${key}`;
    const lockKey = `lock:${key}`;

    // ─────────────────────────────────────────────────────────────
    // PASO 1: Verificación rápida (sin lock)
    // ─────────────────────────────────────────────────────────────
    const existingValue = await this.redis.get(idempotencyKey);
    if (existingValue) {
      console.log(`🔍 [Redis] Clave ya existe (fast path): ${key}`);
      return {
        isDuplicate: true,
        existingReservationId: existingValue,
        lockAcquired: false,
      };
    }

    // ─────────────────────────────────────────────────────────────
    // PASO 2: Intentar adquirir lock distribuido
    // SET key value NX PX milliseconds (atómico)
    // ─────────────────────────────────────────────────────────────
    const lockValue = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}`;
    const lockAcquired = await this.redis.set(
      lockKey,
      lockValue,
      "PX",
      this.lockTtlMs,
      "NX"
    );

    if (!lockAcquired) {
      // Otro proceso tiene el lock, podría ser un duplicado en proceso
      console.log(`🔒 [Redis] No se pudo adquirir lock para: ${key}`);
      // Esperar un poco y verificar de nuevo
      await this.sleep(100);
      const checkAgain = await this.redis.get(idempotencyKey);
      return {
        isDuplicate: !!checkAgain,
        existingReservationId: checkAgain || undefined,
        lockAcquired: false,
      };
    }

    console.log(`🔐 [Redis] Lock adquirido para: ${key}`);

    // ─────────────────────────────────────────────────────────────
    // PASO 3: Segunda verificación (con lock - evita race condition)
    // ─────────────────────────────────────────────────────────────
    const doubleCheck = await this.redis.get(idempotencyKey);
    if (doubleCheck) {
      // Liberar lock y retornar duplicado
      await this.releaseLock(lockKey, lockValue);
      console.log(`🔍 [Redis] Duplicado detectado en double-check: ${key}`);
      return {
        isDuplicate: true,
        existingReservationId: doubleCheck,
        lockAcquired: false,
      };
    }

    // No es duplicado, retornar con lock adquirido
    return {
      isDuplicate: false,
      lockAcquired: true,
    };
  }

  /**
   * Confirma la reserva guardando la idempotencyKey de forma permanente.
   * Debe llamarse DESPUÉS de guardar en la base de datos.
   */
  async confirmReservation(key: string, reservationId: string): Promise<void> {
    const idempotencyKey = `reservation_key:${key}`;
    const lockKey = `lock:${key}`;

    // Guardar idempotency key con TTL
    await this.redis.setex(idempotencyKey, this.ttlSeconds, reservationId);
    console.log(
      `✅ [Redis] IdempotencyKey confirmada: ${key} -> ${reservationId}`
    );

    // Liberar el lock (ya no necesario)
    await this.redis.del(lockKey);
    console.log(`🔓 [Redis] Lock liberado: ${key}`);
  }

  /**
   * Rollback: libera el lock sin confirmar (en caso de error en BD).
   */
  async rollbackLock(key: string): Promise<void> {
    const lockKey = `lock:${key}`;
    await this.redis.del(lockKey);
    console.log(`↩️ [Redis] Lock liberado (rollback): ${key}`);
  }

  /**
   * Libera un lock usando el patrón "compare-and-delete" para evitar
   * liberar locks de otros procesos.
   */
  private async releaseLock(
    lockKey: string,
    lockValue: string
  ): Promise<boolean> {
    // Script Lua para compare-and-delete atómico
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    const result = await this.redis.eval(script, 1, lockKey, lockValue);
    return result === 1;
  }

  /**
   * Verifica si una clave de idempotencia ya existe (método simple).
   * @returns true si ya existe (duplicado), false si es nueva
   */
  async checkIdempotencyKey(key: string): Promise<boolean> {
    const exists = await this.redis.exists(`reservation_key:${key}`);
    return exists === 1;
  }

  /**
   * Almacena una clave de idempotencia con TTL (método simple).
   */
  async setIdempotencyKey(key: string, reservationId: string): Promise<void> {
    await this.redis.setex(
      `reservation_key:${key}`,
      this.ttlSeconds,
      reservationId
    );
  }

  /**
   * Obtiene el ID de reserva asociado a una clave de idempotencia.
   */
  async getIdempotencyKey(key: string): Promise<string | null> {
    return this.redis.get(`reservation_key:${key}`);
  }

  /**
   * Helper para esperar ms milisegundos
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
