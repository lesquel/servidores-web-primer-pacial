# 🚀 MesaYa Microservicios - Guía de Implementación

## 📋 Tabla de Contenidos

1. [Arquitectura General](#arquitectura-general)
2. [Patrón Idempotent Consumer](#patrón-idempotent-consumer)
3. [Configuración y Despliegue](#configuración-y-despliegue)
4. [Flujo de Mensajes](#flujo-de-mensajes)
5. [Pruebas de Chaos](#pruebas-de-chaos)
6. [Troubleshooting](#troubleshooting)

---

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            ARQUITECTURA                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────────┐                                                       │
│   │   Cliente    │                                                       │
│   │   (Angular)  │                                                       │
│   └──────┬───────┘                                                       │
│          │ HTTP + JWT                                                    │
│          ▼                                                               │
│   ┌──────────────┐     RabbitMQ      ┌──────────────────────────────┐   │
│   │   Gateway    │─────────────────▶│       ms-reservations        │   │
│   │   :3000      │◀─────────────────│          :3002                │   │
│   │              │                   │  ┌────────────────────────┐  │   │
│   │  - JWT Auth  │                   │  │     Redis              │  │   │
│   │  - Routing   │                   │  │  ┌────────────────┐    │  │   │
│   │  - Logging   │                   │  │  │ Idempotency    │    │  │   │
│   └──────┬───────┘                   │  │  │ Keys + Locks   │    │  │   │
│          │                           │  │  └────────────────┘    │  │   │
│          │ RabbitMQ                  │  └────────────────────────┘  │   │
│          ▼                           │                              │   │
│   ┌──────────────┐                   │  ┌────────────────────────┐  │   │
│   │  ms-tables   │◀──EventPattern───│  │     PostgreSQL         │  │   │
│   │    :3001     │   (table.*)      │  │     db_reservas        │  │   │
│   │              │                   │  └────────────────────────┘  │   │
│   │  ┌────────┐  │                   └──────────────────────────────┘   │
│   │  │  DB    │  │                                                       │
│   │  │mesas   │  │                                                       │
│   │  └────────┘  │                                                       │
│   └──────────────┘                                                       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Servicios

| Servicio            | Puerto | Responsabilidad                             |
| ------------------- | ------ | ------------------------------------------- |
| **Gateway**         | 3000   | Autenticación JWT, routing, logging         |
| **ms-tables**       | 3001   | Gestión de mesas (entidad maestra)          |
| **ms-reservations** | 3002   | Gestión de reservas (entidad transaccional) |

### Infraestructura

| Componente     | Puerto      | Propósito                              |
| -------------- | ----------- | -------------------------------------- |
| **RabbitMQ**   | 5672, 15672 | Message broker                         |
| **Redis**      | 6379        | Idempotencia + Locks distribuidos      |
| **PostgreSQL** | 5432        | Bases de datos (db_mesas, db_reservas) |

---

## 🔐 Patrón Idempotent Consumer

### ¿Por qué Opción B?

La **Opción B (Idempotent Consumer)** fue elegida porque:

1. **Sin cambios en el cliente**: El cliente envía `idempotencyKey` normalmente
2. **Responsabilidad del microservicio**: El consumidor garantiza idempotencia
3. **Mejor para escenarios de duplicación por broker**: RabbitMQ puede reenviar mensajes

### Flujo Check-Lock-Check

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     FLUJO IDEMPOTENCIA AVANZADA                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   Request 1 ──┬──▶ checkAndLock() ──▶ ¿Existe key? ──▶ NO              │
│   Request 2 ──┤                            │                            │
│   Request 3 ──┤                            ▼                            │
│   Request 4 ──┤                    SET lock con NX                      │
│   Request 5 ──┘                            │                            │
│                                            ▼                            │
│                            ┌───────────────────────────┐                │
│                            │   Solo 1 obtiene el lock  │                │
│                            └───────────────┬───────────┘                │
│                                            │                            │
│                    ┌───────────────────────┼───────────────────────┐    │
│                    ▼                       ▼                       ▼    │
│               Request 1              Request 2-5             (timeout)  │
│               (ganador)              (perdedores)                       │
│                    │                       │                            │
│                    ▼                       ▼                            │
│            Procesa reserva         Rechazados 409                       │
│                    │               "Duplicado"                          │
│                    ▼                                                    │
│            confirmReservation()                                         │
│            SET key PERMANENT                                            │
│            DEL lock                                                     │
│                    │                                                    │
│                    ▼                                                    │
│              Retorna 201                                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Implementación en Redis

```typescript
// redis.service.ts - Métodos clave

// 1. CHECK - Verifica si ya existe
async checkIdempotency(key: string): Promise<boolean>

// 2. LOCK - Intenta obtener bloqueo exclusivo (SET NX PX)
async checkAndLock(key: string): Promise<{
  isDuplicate: boolean;
  lockAcquired: boolean;
}>

// 3. CONFIRM - Confirma reserva y libera lock
async confirmReservation(key: string, reservationId: string): Promise<void>

// 4. ROLLBACK - Rollback atómico (Lua script)
async rollbackLock(key: string, expectedValue: string): Promise<void>
```

---

## ⚙️ Configuración y Despliegue

### 1. Preparar Ambiente

```bash
# Copiar archivo de configuración
cp .env.example .env

# Editar según necesidad
nano .env
```

### 2. Variables de Entorno

```env
# RabbitMQ
RABBITMQ_URL=amqp://admin:admin123@rabbitmq:5672

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# PostgreSQL
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=mesa_ya_user
DB_PASSWORD=mesa_ya_pass

# JWT (mismo secreto que el monolito)
JWT_SECRET=your-secret-key
```

### 3. Levantar Servicios

```bash
# Levantar toda la infraestructura
docker compose up -d

# Ver logs en tiempo real
docker compose logs -f gateway ms-tables ms-reservations

# Solo infraestructura (para desarrollo local)
docker compose up -d rabbitmq redis postgres
```

### 4. Verificar Servicios

```bash
# Health checks
curl http://localhost:3000/health  # Gateway
curl http://localhost:3001/health  # ms-tables (solo interno)
curl http://localhost:3002/health  # ms-reservations (solo interno)

# RabbitMQ Management
open http://localhost:15672  # admin:admin123
```

---

## 📡 Flujo de Mensajes

### Crear Reserva

```mermaid
sequenceDiagram
    participant C as Cliente
    participant G as Gateway
    participant R as RabbitMQ
    participant MS as ms-reservations
    participant RD as Redis
    participant DB as PostgreSQL

    C->>G: POST /api/reservations
    Note over G: Valida JWT
    G->>R: Publish { cmd: 'create_reservation' }
    R->>MS: Deliver message
    MS->>RD: checkAndLock(idempotencyKey)
    alt Lock adquirido
        MS->>DB: INSERT reservation
        MS->>R: Emit 'table.occupied'
        MS->>RD: confirmReservation()
        MS->>G: Return 201 + reservation
        G->>C: 201 Created
    else Duplicado
        MS->>G: Return 409 Conflict
        G->>C: 409 Conflict
    end
```

### Patrones de Mensajes

| Pattern                     | Tipo           | Origen          | Destino         |
| --------------------------- | -------------- | --------------- | --------------- |
| `create_reservation`        | MessagePattern | Gateway         | ms-reservations |
| `list_reservations`         | MessagePattern | Gateway         | ms-reservations |
| `find_reservation`          | MessagePattern | Gateway         | ms-reservations |
| `update_reservation_status` | MessagePattern | Gateway         | ms-reservations |
| `find_table`                | MessagePattern | Gateway         | ms-tables       |
| `list_tables`               | MessagePattern | Gateway         | ms-tables       |
| `table.occupied`            | EventPattern   | ms-reservations | ms-tables       |
| `table.released`            | EventPattern   | ms-reservations | ms-tables       |

---

## 🧪 Pruebas de Chaos

### Ejecutar Test

```bash
# Primero obtener JWT del backend monolito
JWT=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}' \
  | jq -r '.accessToken')

# Ejecutar chaos test
node chaos-test.js $JWT
```

### Resultado Esperado

```
═══════════════════════════════════════════════════════════════════════════
   🧪 CHAOS TEST - PATRÓN IDEMPOTENT CONSUMER
═══════════════════════════════════════════════════════════════════════════

📋 Configuración:
   Gateway URL:        http://localhost:3000
   Solicitudes:        5 (simultáneas)
   IdempotencyKey:     chaos-test-1234567890-abc123

🚀 Iniciando chaos test...
📤 Enviando 5 solicitudes simultáneas con la misma idempotencyKey...

📋 Resultados individuales:

✅ Request #3: 201 Created (45ms) - Reserva creada: uuid-xxx
🚫 Request #1: 409 Conflict (47ms) - Duplicada
🚫 Request #2: 409 Conflict (48ms) - Duplicada
🚫 Request #4: 409 Conflict (46ms) - Duplicada
🚫 Request #5: 409 Conflict (44ms) - Duplicada

═══════════════════════════════════════════════════════════════════════════
   📊 RESUMEN DE RESULTADOS
═══════════════════════════════════════════════════════════════════════════

   ✅ Exitosas:      1
   🚫 Duplicadas:    4
   ❌ Errores:       0
   ⏱️  Tiempo prom:    46ms

───────────────────────────────────────────────────────────────────────────
   🎉 ¡ÉXITO! El patrón Idempotent Consumer funciona correctamente.

   Solo 1 reserva fue creada, las demás fueron rechazadas como
   duplicadas gracias al bloqueo distribuido en Redis.
═══════════════════════════════════════════════════════════════════════════
```

### Monitorear en Tiempo Real

```bash
# Ver logs de Redis (idempotencia)
docker compose logs -f ms-reservations | grep -E "🔐|✅|🚫|⚠️"

# Ver mensajes en RabbitMQ
open http://localhost:15672/#/queues
```

---

## 🔧 Troubleshooting

### Problema: Todas las solicitudes fallan con 401

**Causa**: JWT inválido o expirado

**Solución**:

```bash
# Obtener nuevo JWT
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

### Problema: Múltiples reservas creadas (race condition)

**Causa**: Redis no disponible o configuración incorrecta

**Solución**:

```bash
# Verificar Redis
docker compose exec redis redis-cli PING

# Verificar conexión desde ms-reservations
docker compose exec ms-reservations sh -c 'nc -zv redis 6379'
```

### Problema: Timeout en RabbitMQ

**Causa**: Cola no existe o microservicio caído

**Solución**:

```bash
# Reiniciar servicios
docker compose restart ms-reservations ms-tables

# Ver estado de colas
curl -u admin:admin123 http://localhost:15672/api/queues
```

### Problema: Error de conexión a PostgreSQL

**Causa**: Base de datos no inicializada

**Solución**:

```bash
# Recrear contenedor postgres
docker compose down postgres
docker volume rm mesaya_postgres_data
docker compose up -d postgres

# El script init-db.sh creará las DBs automáticamente
```

---

## 📚 Referencias

- [Patrón Idempotent Consumer](https://microservices.io/patterns/communication-style/idempotent-consumer.html)
- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
- [RabbitMQ Best Practices](https://www.rabbitmq.com/production-checklist.html)
- [Redis Distributed Locks](https://redis.io/topics/distlock)

---

## 📝 Notas Adicionales

### Convenciones de Logging

| Emoji | Significado                     |
| ----- | ------------------------------- |
| 📥    | Mensaje recibido                |
| 📤    | Mensaje enviado                 |
| ✅    | Operación exitosa               |
| 🚫    | Operación rechazada (duplicado) |
| ❌    | Error                           |
| 🔐    | Operación de idempotencia       |
| ⏱️    | Información de tiempo           |

### TTL de Claves Redis

| Tipo           | TTL      | Propósito                |
| -------------- | -------- | ------------------------ |
| Lock temporal  | 30 seg   | Evita deadlocks          |
| Key confirmada | 24 horas | Idempotencia persistente |
