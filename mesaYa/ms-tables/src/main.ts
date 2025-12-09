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
        queue: "tables_queue",
        queueOptions: {
          durable: true,
        },
      },
    }
  );

  await app.listen();
  console.log(
    "🪑 ms-tables microservice is listening on RabbitMQ (tables_queue)"
  );
}
bootstrap();
