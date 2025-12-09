import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";

async function bootstrap() {
  // Crear microservicio que escucha por RabbitMQ
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
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
    }
  );

  await app.listen();
  console.log(
    "📅 ms-reservations microservice is listening on RabbitMQ (reservations_queue)"
  );
}
bootstrap();
