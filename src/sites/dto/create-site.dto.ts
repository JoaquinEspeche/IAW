import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreateSiteDto {
  @ApiProperty({ example: '65e9f1a2b3c4d5e6f7a8b9c0', description: 'ID de la Cuenta dueña del sitio' })
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @ApiProperty({ example: 'Sitio Corporativo Ejemplo', description: 'Nombre identificador del sitio' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'https://example.com', description: 'URL raíz a crawlear/inspeccionar' })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ example: 2, description: 'Niveles de profundidad de páginas a recorrer (p.ej. 2 o 3)', default: 2 })
  @IsNumber()
  @Min(1)
  maxDepth: number;

  @ApiProperty({ example: 'every 24 hours', description: 'Frecuencia de ejecución del crawl', default: '0 0 * * *' })
  @IsString()
  @IsNotEmpty()
  frequency: string;

  @ApiProperty({
    example: `function extract(request, response) {\n  let $ = cheerio.load(response.body);\n  return [{\n    name: $('title').text(),\n    url: request.url,\n    description: $('meta[name="description"]').attr('content') || $('p').first().text()\n  }];\n}`,
    description: 'Snippet JS extractor de documentos con CheerIO/DOM',
  })
  @IsString()
  @IsNotEmpty()
  documentExtractor: string;

  @ApiPropertyOptional({
    example: `function pageResolver(request, response) {\n  let $ = cheerio.load(response.body);\n  let links = [];\n  $('a').each((i, el) => { links.push($(el).attr('href')); });\n  return links;\n}`,
    description: 'Snippet JS opcional para descubrir links en páginas',
  })
  @IsString()
  @IsOptional()
  pageResolver?: string;
}
