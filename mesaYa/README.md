# MesaYa Microservices Architecture

Este proyecto implementa la arquitectura de microservicios para MesaYa, separando el monolito original en servicios independientes con comunicación asíncrona via RabbitMQ.

## 📁 Estructura del Proyecto

```
mesaYa/
├── docker-compose.yml          # Orquestación de contenedores
├── .env.example                # Variables de entorno de ejemplo
├── scripts/
│   └── init-db.sh             # Script para crear las dos BDs
├── gateway/                    # API Gateway (Puerto 3000)
│   ├── src/
│   │   ├── auth/              # Módulo de autenticación JWT
│   │   ├── reservations/      # Proxy hacia ms-reservations
│   │   └── tables/            # Proxy hacia ms-tables
│   └── Dockerfile
├── ms-tables/                  # Microservicio de Mesas (Entidad Maestra)
│   ├── src/
│   │   └── tables/            # Lógica de mesas
│   └── Dockerfile
└── ms-reservations/            # Microservicio de Reservas (Entidad Transaccional)
    ├── src/
    │   ├── reservations/      # Lógica de reservas
    │   └── redis/             # Servicio de idempotencia
    └── Dockerfile
```

## 🚀 Inicio Rápido

### 1. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con tus valores
```

### 2. Levantar infraestructura

```bash
docker-compose up -d rabbitmq redis postgres
```

### 3. Instalar dependencias de cada servicio

```bash
cd gateway && npm install && cd ..
cd ms-tables && npm install && cd ..
cd ms-reservations && npm install && cd ..
```

### 4. Iniciar servicios en desarrollo

Abre 3 terminales:

```bash
# Terminal 1 - Gateway
cd gateway && npm run dev

# Terminal 2 - ms-tables
cd ms-tables && npm run dev

# Terminal 3 - ms-reservations
cd ms-reservations && npm run dev
```

### 5. O levantar todo con Docker

```bash
docker-compose up --build
```

## 🔌 Puertos y URLs

| Servicio            | Puerto | URL                       |
| ------------------- | ------ | ------------------------- |
| Gateway API         | 3000   | http://localhost:3000     |
| RabbitMQ Management | 15672  | http://localhost:15672    |
| RabbitMQ AMQP       | 5672   | amqp://localhost:5672     |
| Redis               | 6379   | redis://localhost:6379    |
| PostgreSQL          | 5432   | postgres://localhost:5432 |

## 📚 API Endpoints

### Health Check

```
GET /api/v1/
```

### Reservaciones (requiere JWT)

```
POST /api/v1/reservations
GET  /api/v1/reservations
GET  /api/v1/reservations/:id
```

### Mesas (público)

```
GET /api/v1/tables
GET /api/v1/tables/:id
GET /api/v1/tables/section/:sectionId
```

## 🔐 Autenticación

El Gateway valida tokens JWT. Incluir en headers:

```
Authorization: Bearer <tu-token>
```

## 🛡️ Idempotencia

Cada reserva requiere un `idempotencyKey` único:

```json
{
  "idempotencyKey": "reservation-2024-12-09-user123-table456",
  "restaurantId": "uuid",
  "tableId": "uuid",
  "reservationDate": "2024-12-15",
  "reservationTime": "2024-12-15T19:00:00Z",
  "numberOfGuests": 4
}
```

Si envías la misma `idempotencyKey` dos veces, recibirás:

```json
{
  "statusCode": 409,
  "message": "Reservation with this idempotencyKey already exists",
  "idempotencyKey": "reservation-2024-12-09-user123-table456"
}
```

## 🗄️ Bases de Datos

| Base de Datos | Microservicio   | Descripción                      |
| ------------- | --------------- | -------------------------------- |
| db_mesas      | ms-tables       | Entidad maestra (mesas)          |
| db_reservas   | ms-reservations | Entidad transaccional (reservas) |

## 📨 Eventos RabbitMQ

| Evento           | Emisor          | Receptor  | Descripción             |
| ---------------- | --------------- | --------- | ----------------------- |
| `table.occupied` | ms-reservations | ms-tables | Marca mesa como ocupada |
| `table.released` | ms-reservations | ms-tables | Libera mesa             |

## 🧪 Prueba de Idempotencia

Script para probar que la idempotencia funciona:

```bash
# Enviar 5 requests paralelas con la misma idempotencyKey
# Solo 1 debe pasar, 4 deben fallar con 409
node gateway/tools/chaos-test.js
```

## 📊 Diagrama de Arquitectura

```
┌─────────────────┐
│     Cliente     │
│   (Frontend)    │
└────────┬────────┘
         │ HTTP + JWT
         ▼
┌─────────────────┐
│   API Gateway   │ ◄── Valida JWT, extrae userId
│   (Puerto 3000) │
└────────┬────────┘
         │ RabbitMQ
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌─────────────┐
│  ms-  │ │    ms-      │
│tables │ │reservations │
└───┬───┘ └──────┬──────┘
    │            │
    ▼            ▼
┌───────┐ ┌─────────────┐
│db_mesa│ │ db_reservas │
│   s   │ └──────┬──────┘
└───────┘        │
                 ▼
            ┌────────┐
            │ Redis  │ ◄── Idempotency keys
            └────────┘
```
