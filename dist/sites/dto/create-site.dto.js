"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSiteDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateSiteDto {
}
exports.CreateSiteDto = CreateSiteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '65e9f1a2b3c4d5e6f7a8b9c0', description: 'ID de la Cuenta dueña del sitio' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSiteDto.prototype, "accountId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sitio Corporativo Ejemplo', description: 'Nombre identificador del sitio' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSiteDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com', description: 'URL raíz a crawlear/inspeccionar' }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSiteDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, description: 'Niveles de profundidad de páginas a recorrer (p.ej. 2 o 3)', default: 2 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateSiteDto.prototype, "maxDepth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'every 24 hours', description: 'Frecuencia de ejecución del crawl', default: '0 0 * * *' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSiteDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: `function extract(request, response) {\n  let $ = cheerio.load(response.body);\n  return [{\n    name: $('title').text(),\n    url: request.url,\n    description: $('meta[name="description"]').attr('content') || $('p').first().text()\n  }];\n}`,
        description: 'Snippet JS extractor de documentos con CheerIO/DOM',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSiteDto.prototype, "documentExtractor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: `function pageResolver(request, response) {\n  let $ = cheerio.load(response.body);\n  let links = [];\n  $('a').each((i, el) => { links.push($(el).attr('href')); });\n  return links;\n}`,
        description: 'Snippet JS opcional para descubrir links en páginas',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSiteDto.prototype, "pageResolver", void 0);
//# sourceMappingURL=create-site.dto.js.map