import { Controller } from "@nestjs/common";
import { MessagePattern, EventPattern, Payload } from "@nestjs/microservices";
import { TablesService } from "./tables.service";

@Controller()
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  /**
   * Responde a petición de listar todas las mesas
   */
  @MessagePattern({ cmd: "list_tables" })
  async listTables() {
    return this.tablesService.findAll();
  }

  /**
   * Responde a petición de buscar una mesa por ID
   */
  @MessagePattern({ cmd: "find_table" })
  async findTable(@Payload() data: { id: string }) {
    return this.tablesService.findOne(data.id);
  }

  /**
   * Responde a petición de listar mesas por sección
   */
  @MessagePattern({ cmd: "list_section_tables" })
  async listSectionTables(@Payload() data: { sectionId: string }) {
    return this.tablesService.findBySection(data.sectionId);
  }

  /**
   * Evento: Cuando una reserva se crea, marcar la mesa como OCCUPIED
   * Este evento llega desde ms-reservations vía RabbitMQ
   */
  @EventPattern("table.occupied")
  async handleTableOccupied(
    @Payload() data: { tableId: string; reservationId: string; userId: string }
  ) {
    console.log(`📥 Evento table.occupied recibido:`, data);
    await this.tablesService.updateStatus(data.tableId, "OCCUPIED");
    console.log(`✅ Mesa ${data.tableId} marcada como OCCUPIED`);
  }

  /**
   * Evento: Cuando una reserva se cancela/completa, liberar la mesa
   */
  @EventPattern("table.released")
  async handleTableReleased(@Payload() data: { tableId: string }) {
    console.log(`📥 Evento table.released recibido:`, data);
    await this.tablesService.updateStatus(data.tableId, "AVAILABLE");
    console.log(`✅ Mesa ${data.tableId} marcada como AVAILABLE`);
  }
}
