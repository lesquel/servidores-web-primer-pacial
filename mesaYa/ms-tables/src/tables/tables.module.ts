import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TablesController } from "./tables.controller";
import { TablesService } from "./tables.service";
import { TableEntity } from "./entities/table.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TableEntity])],
  controllers: [TablesController],
  providers: [TablesService],
  exports: [TablesService],
})
export class TablesModule {}
