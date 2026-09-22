import { Controller, Get, Post, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { SnapshotsService } from './snapshots.service';
import { Snapshot } from './schemas/snapshot.schema';

@ApiTags('Snapshots / Crawling Jobs')
@Controller('snapshots')
export class SnapshotsController {
  constructor(private readonly snapshotsService: SnapshotsService) {}

  @Get('site/:siteId')
  @ApiOperation({ summary: 'Listar capturas/snapshots realizadas a un sitio' })
  @ApiParam({ name: 'siteId', description: 'ID del sitio' })
  findBySite(@Param('siteId') siteId: string): Promise<Snapshot[]> {
    return this.snapshotsService.findBySite(siteId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener estado y detalle de una captura/snapshot' })
  @ApiParam({ name: 'id', description: 'ID del snapshot' })
  findOne(@Param('id') id: string): Promise<Snapshot> {
    return this.snapshotsService.findOne(id);
  }

  @Post('site/:siteId/trigger')
  @ApiOperation({ summary: 'Disparar manualmente un job de crawling (Generar Snapshot)' })
  @ApiParam({ name: 'siteId', description: 'ID del sitio a inspeccionar' })
  triggerCrawl(@Param('siteId') siteId: string): Promise<Snapshot> {
    return this.snapshotsService.triggerCrawl(siteId);
  }
}
