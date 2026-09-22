import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Site } from './schemas/site.schema';

@ApiTags('Sites')
@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo sitio a inspeccionar' })
  @ApiResponse({ status: 201, description: 'Sitio registrado exitosamente.' })
  create(@Body() createSiteDto: CreateSiteDto): Promise<Site> {
    return this.sitesService.create(createSiteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los sitios' })
  @ApiQuery({ name: 'accountId', required: false, description: 'Filtrar por ID de cuenta' })
  findAll(@Query('accountId') accountId?: string): Promise<Site[]> {
    if (accountId) {
      return this.sitesService.findByAccount(accountId);
    }
    return this.sitesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener información detallada de un sitio' })
  @ApiParam({ name: 'id', description: 'ID del sitio' })
  findOne(@Param('id') id: string): Promise<Site> {
    return this.sitesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar la configuración de un sitio' })
  @ApiParam({ name: 'id', description: 'ID del sitio' })
  update(
    @Param('id') id: string,
    @Body() updateSiteDto: UpdateSiteDto,
  ): Promise<Site> {
    return this.sitesService.update(id, updateSiteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un sitio' })
  @ApiParam({ name: 'id', description: 'ID del sitio' })
  remove(@Param('id') id: string) {
    return this.sitesService.remove(id);
  }
}
