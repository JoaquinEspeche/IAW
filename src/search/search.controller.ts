import { Controller, Get, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiHeader } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({
    summary: 'Buscar documentos extraídos en base a una keyphrase',
    description:
      'Busca información en los documentos capturados utilizando el índice de texto de MongoDB. Requiere API Key en la cabecera x-api-key o como parámetro de query apiKey.',
  })
  @ApiQuery({ name: 'q', required: true, description: 'Keyphrase a buscar (ejemplo: palabra1+palabra2 o "catálogo")' })
  @ApiQuery({ name: 'apiKey', required: false, description: 'API Key de la cuenta (opcional si se envía en header)' })
  @ApiHeader({ name: 'x-api-key', required: false, description: 'API Key de la cuenta' })
  @ApiHeader({ name: 'authorization', required: false, description: 'API Key de la cuenta o Bearer <apiKey>' })
  search(
    @Query('q') query: string,
    @Query('apiKey') queryApiKey?: string,
    @Headers('x-api-key') headerApiKey?: string,
    @Headers('authorization') authHeader?: string,
  ) {
    let apiKey = queryApiKey || headerApiKey;
    if (!apiKey && authHeader) {
      apiKey = authHeader.replace(/^Bearer\s+/i, '').trim();
    }
    return this.searchService.search(query, apiKey);
  }
}
