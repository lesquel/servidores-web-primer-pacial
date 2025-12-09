import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TableEntity, TableStatus } from "./entities/table.entity";

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(TableEntity)
    private readonly tableRepository: Repository<TableEntity>
  ) {}

  async findAll(): Promise<TableEntity[]> {
    return this.tableRepository.find();
  }

  async findOne(id: string): Promise<TableEntity> {
    const table = await this.tableRepository.findOne({ where: { id } });
    if (!table) {
      throw new NotFoundException(`Table with ID ${id} not found`);
    }
    return table;
  }

  async findBySection(sectionId: string): Promise<TableEntity[]> {
    return this.tableRepository.find({ where: { sectionId } });
  }

  /**
   * Actualiza el estado de una mesa.
   * Este método es llamado cuando se recibe un evento desde ms-reservations.
   */
  async updateStatus(id: string, status: TableStatus): Promise<TableEntity> {
    const table = await this.findOne(id);
    table.status = status;
    table.isAvailable = status === "AVAILABLE";
    return this.tableRepository.save(table);
  }

  async create(data: Partial<TableEntity>): Promise<TableEntity> {
    const table = this.tableRepository.create(data);
    return this.tableRepository.save(table);
  }
}
