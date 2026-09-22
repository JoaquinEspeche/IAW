import { Controller, Get, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { ExtractedDocument } from './schemas/extracted-document.schema';

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get('snapshot/:snapshotId')
  @ApiOperation({ summary: 'Obtener todos los documentos extraídos en una foto/snapshot' })
  @ApiParam({ name: 'snapshotId', description: 'ID del snapshot' })
  findBySnapshot(@Param('snapshotId') snapshotId: string): Promise<ExtractedDocument[]> {
    return this.documentsService.findBySnapshot(snapshotId);
  }

  @Get('site/:siteId')
  @ApiOperation({ summary: 'Obtener todos los documentos extraídos de un sitio' })
  @ApiParam({ name: 'siteId', description: 'ID del sitio' })
  findBySite(@Param('siteId') siteId: string): Promise<ExtractedDocument[]> {
    return this.documentsService.findBySite(siteId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de un documento por ID' })
  @ApiParam({ name: 'id', description: 'ID del documento' })
  findOne(@Param('id') id: string): Promise<ExtractedDocument> {
    return this.documentsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un documento' })
  @ApiParam({ name: 'id', description: 'ID del documento' })
  remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }
}
