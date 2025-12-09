import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TablesModule } from "./tables/tables.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "../.env",
    }),

    // Conexión a db_mesas (Base de datos independiente)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get<string>("MS_TABLES_DB_HOST") || "localhost",
        port: config.get<number>("MS_TABLES_DB_PORT") || 5432,
        username: config.get<string>("MS_TABLES_DB_USER") || "mesaya",
        password:
          config.get<string>("MS_TABLES_DB_PASSWORD") || "mesaya_secret",
        database: config.get<string>("MS_TABLES_DB_NAME") || "db_mesas",
        autoLoadEntities: true,
        synchronize: true, // Solo en desarrollo
      }),
    }),

    TablesModule,
  ],
})
export class AppModule {}
