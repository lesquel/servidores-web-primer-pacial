import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AuthModule } from "./auth/auth.module";
import { ReservationsModule } from "./reservations/reservations.module";
import { TablesModule } from "./tables/tables.module";
import { HealthController } from "./health.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "../.env",
    }),

    // Conexión RabbitMQ para comunicación con microservicios
    ClientsModule.register([
      {
        name: "RESERVATIONS_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ||
              "amqp://mesaya:mesaya_secret@localhost:5672",
          ],
          queue: "reservations_queue",
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: "TABLES_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ||
              "amqp://mesaya:mesaya_secret@localhost:5672",
          ],
          queue: "tables_queue",
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),

    AuthModule,
    ReservationsModule,
    TablesModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
