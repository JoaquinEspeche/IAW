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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const search_service_1 = require("./search.service");
let SearchController = class SearchController {
    constructor(searchService) {
        this.searchService = searchService;
    }
    search(query, queryApiKey, headerApiKey, authHeader) {
        let apiKey = queryApiKey || headerApiKey;
        if (!apiKey && authHeader) {
            apiKey = authHeader.replace(/^Bearer\s+/i, '').trim();
        }
        return this.searchService.search(query, apiKey);
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Buscar documentos extraídos en base a una keyphrase',
        description: 'Busca información en los documentos capturados utilizando el índice de texto de MongoDB. Requiere API Key en la cabecera x-api-key o como parámetro de query apiKey.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: true, description: 'Keyphrase a buscar (ejemplo: palabra1+palabra2 o "catálogo")' }),
    (0, swagger_1.ApiQuery)({ name: 'apiKey', required: false, description: 'API Key de la cuenta (opcional si se envía en header)' }),
    (0, swagger_1.ApiHeader)({ name: 'x-api-key', required: false, description: 'API Key de la cuenta' }),
    (0, swagger_1.ApiHeader)({ name: 'authorization', required: false, description: 'API Key de la cuenta o Bearer <apiKey>' }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('apiKey')),
    __param(2, (0, common_1.Headers)('x-api-key')),
    __param(3, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], SearchController.prototype, "search", null);
exports.SearchController = SearchController = __decorate([
    (0, swagger_1.ApiTags)('Search'),
    (0, common_1.Controller)('search'),
    __metadata("design:paramtypes", [search_service_1.SearchService])
], SearchController);
//# sourceMappingURL=search.controller.js.map