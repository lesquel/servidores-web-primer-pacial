import {
  Controller,
  Get,
  Param,
  Inject,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { firstValueFrom, timeout } from "rxjs";

@ApiTags("Tables")
@Controller("tables")
export class TablesController {
  constructor(
    @Inject("TABLES_SERVICE") private readonly tablesClient: ClientProxy
  ) {}

  /**
   * GET /api/v1/tables
   * Lista todas las mesas disponibles.
   */
  @Get()
  @ApiOperation({ summary: "Listar todas las mesas" })
  async findAll() {
    try {
      const result = await firstValueFrom(
        this.tablesClient.send({ cmd: "list_tables" }, {}).pipe(timeout(10000))
      );
      return result;
    } catch (error: any) {
      throw new HttpException(
        error?.message || "Error fetching tables",
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * GET /api/v1/tables/:id
   * Obtiene una mesa por ID.
   */
  @Get(":id")
  @ApiOperation({ summary: "Obtener detalle de una mesa" })
  async findOne(@Param("id") id: string) {
    try {
      const result = await firstValueFrom(
        this.tablesClient
          .send({ cmd: "find_table" }, { id })
          .pipe(timeout(10000))
      );
      return result;
    } catch (error: any) {
      throw new HttpException(
        error?.message || "Table not found",
        error?.status || HttpStatus.NOT_FOUND
      );
    }
  }

  /**
   * GET /api/v1/tables/section/:sectionId
   * Lista mesas por sección.
   */
  @Get("section/:sectionId")
  @ApiOperation({ summary: "Listar mesas por sección" })
  async findBySection(@Param("sectionId") sectionId: string) {
    try {
      const result = await firstValueFrom(
        this.tablesClient
          .send({ cmd: "list_section_tables" }, { sectionId })
          .pipe(timeout(10000))
      );
      return result;
    } catch (error: any) {
      throw new HttpException(
        error?.message || "Error fetching tables",
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
