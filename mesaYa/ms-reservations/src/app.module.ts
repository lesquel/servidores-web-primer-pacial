import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ReservationsModule } from "./reservations/reservations.module";
import { RedisModule } from "./redis/redis.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "../.env",
    }),

    // Conexión a db_reservas (Base de datos independiente)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get<string>("MS_RESERVATIONS_DB_HOST") || "localhost",
        port: config.get<number>("MS_RESERVATIONS_DB_PORT") || 5432,
        username: config.get<string>("MS_RESERVATIONS_DB_USER") || "mesaya",
        password:
          config.get<string>("MS_RESERVATIONS_DB_PASSWORD") || "mesaya_secret",
        database:
          config.get<string>("MS_RESERVATIONS_DB_NAME") || "db_reservas",
        autoLoadEntities: true,
        synchronize: true, // Solo en desarrollo
      }),
    }),

    // Cliente RabbitMQ para emitir eventos a ms-tables
    ClientsModule.registerAsync([
      {
        name: "TABLES_SERVICE",
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              config.get<string>("RABBITMQ_URL") ||
                "amqp://mesaya:mesaya_secret@localhost:5672",
            ],
            queue: "tables_queue",
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),

    RedisModule,
    ReservationsModule,
  ],
})
export class AppModule {}
