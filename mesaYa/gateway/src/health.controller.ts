import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("Health")
@Controller()
export class HealthController {
  @Get()
  @ApiOperation({ summary: "Health check del Gateway" })
  health() {
    return {
      status: "ok",
      service: "MesaYa Gateway",
      timestamp: new Date().toISOString(),
    };
  }
}
