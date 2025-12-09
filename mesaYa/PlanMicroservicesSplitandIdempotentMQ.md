# Plan: Microservices Split and Idempotent MQ (Opción B - Idempotent Consumer)

> **Estado**: ✅ COMPLETADO  
> **Última actualización**: Implementación completa de Fases 1-5

## Objetivo General

Transformar MesaYa en tres servicios NestJS más un API Gateway protegido que valida JWT, con mensajería RabbitMQ, cache Redis para idempotencia **avanzada con bloqueo distribuido** y dos bases de datos independientes en Postgres.

---

## ✅ Fase 1 – Infraestructura Docker (COMPLETADA)

**Archivos creados:**

- `docker-compose.yml` - Orquestación completa
- `.env.example` - Variables de entorno documentadas
- `init-db.sh` - Script de inicialización de bases de datos

**Servicios levantados:**

- `rabbitmq:3-management` con usuario/password seguros y puertos 5672/15672 expuestos.
- `redis:7-alpine` con persistencia mínima.
- `postgres:16-alpine` con dos bases de datos (`db_mesas` y `db_reservas`) creadas vía script.
- Network compartida `mesaya-network` para comunicación interna.

---

## ✅ Fase 2 – Separación en Servicios NestJS (COMPLETADA)

**Estructura creada:**

```
mesaYa/
├── gateway/           # API Gateway con JWT
├── ms-tables/         # Microservicio de mesas
├── ms-reservations/   # Microservicio de reservas
├── docker-compose.yml
├── .env.example
└── init-db.sh
```

**Detalles:**

- `ms-tables`: TypeORM conectado a `db_mesas`, entidades y servicios de mesas
- `ms-reservations`: TypeORM conectado a `db_reservas`, entidades con `tableId: string`
- Cada servicio con su propio `package.json` y dependencias instaladas

---

## ✅ Fase 3 – Gateway con Auth y Validación (COMPLETADA)

**Implementaciones:**

- `JwtStrategy` y `JwtAuthGuard` para validación de tokens
- `@CurrentUser()` decorator para extraer userId
- `ReservationsController` con endpoints protegidos:
  - `POST /api/reservations` - Crear reserva
  - `GET /api/reservations` - Listar mis reservas
  - `GET /api/reservations/:id` - Detalle de reserva
  - `PATCH /api/reservations/:id/status` - Actualizar estado
- `ClientProxy` de RabbitMQ configurado para cada microservicio
- Logging avanzado con tiempos de procesamiento

---

## ✅ Fase 4 – Comunicación RabbitMQ e Idempotencia Avanzada (COMPLETADA)

### ms-reservations

**Patrón Check-Lock-Check implementado:**

```typescript
// 1. Verificar si ya existe la clave
const existsCheck = await redis.checkIdempotency(key);

// 2. Intentar obtener lock exclusivo (SET NX PX)
const { isDuplicate, lockAcquired } = await redis.checkAndLock(key);

// 3. Si obtuvo lock, procesar
if (lockAcquired) {
  // Crear reserva en DB
  await reservationRepository.save(reservation);

  // Emitir evento de mesa ocupada
  client.emit("table.occupied", { tableId, reservationId });

  // Confirmar y liberar lock
  await redis.confirmReservation(key, reservationId);
}
```

**Características:**

- Lock temporal con TTL de 30 segundos (evita deadlocks)
- Confirmación permanente con TTL de 24 horas
- Rollback atómico con script Lua
- Logging detallado de cada paso

### ms-tables

- `@EventPattern('table.occupied')` - Actualiza mesa a ocupada
- `@EventPattern('table.released')` - Libera mesa
- `@MessagePattern` para consultas síncronas

---

## ✅ Fase 5 – Scripts de Prueba y Documentación (COMPLETADA)

**Archivos creados:**

- `chaos-test.js` - Script que lanza 5 requests paralelas con misma idempotencyKey
- `MICROSERVICES_GUIDE.md` - Documentación completa de arquitectura

**Resultado esperado del chaos test:**

```
✅ Exitosas:      1
🚫 Duplicadas:    4
❌ Errores:       0

🎉 ¡ÉXITO! El patrón Idempotent Consumer funciona correctamente.
```

**Verificaciones:**

- ✅ Gateway bloquea requests sin JWT (401)
- ✅ `ms-reservations` solo recibe userId validado desde Gateway
- ✅ Redis previene duplicados con bloqueo distribuido
- ✅ `ms-tables` se comunica únicamente vía RabbitMQ

---

## Resumen de Decisiones Clave

| Decisión            | Implementación                                             |
| ------------------- | ---------------------------------------------------------- |
| Autenticación       | Gateway valida JWT, microservicios confían en userId       |
| Base de datos       | Un contenedor Postgres, dos bases lógicas                  |
| Idempotencia        | **Opción B** - Idempotent Consumer con Redis locks         |
| Comunicación        | RabbitMQ para sync (MessagePattern) y async (EventPattern) |
| Bloqueo distribuido | SET NX PX + Double-check + Lua scripts                     |

---

## Comandos Útiles

```bash
# Levantar infraestructura
docker compose up -d

# Ver logs en tiempo real
docker compose logs -f gateway ms-tables ms-reservations

# Ejecutar chaos test
node chaos-test.js <JWT_TOKEN>

# RabbitMQ Management
open http://localhost:15672  # admin:admin123
```
