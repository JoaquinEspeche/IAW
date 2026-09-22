import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('Seed / Demo Data')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @ApiOperation({ summary: 'Generar datos de prueba (Cuentas, Sitios, Snapshots y Documentos)' })
  runSeed() {
    return this.seedService.runSeed();
  }
}
