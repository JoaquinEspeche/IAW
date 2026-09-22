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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const accounts_service_1 = require("../accounts/accounts.service");
const sites_service_1 = require("../sites/sites.service");
const documents_service_1 = require("../documents/documents.service");
let SearchService = class SearchService {
    constructor(accountsService, sitesService, documentsService) {
        this.accountsService = accountsService;
        this.sitesService = sitesService;
        this.documentsService = documentsService;
    }
    async search(keyphrase, apiKey) {
        if (!apiKey) {
            throw new common_1.UnauthorizedException('API Key es requerida para realizar búsquedas');
        }
        const account = await this.accountsService.findByApiKey(apiKey);
        if (!account) {
            throw new common_1.UnauthorizedException('API Key inválida o no registrada');
        }
        const sites = await this.sitesService.findByAccount(account._id.toString());
        const siteIds = sites.map((s) => s._id.toString());
        return this.documentsService.searchByText(siteIds, keyphrase);
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [accounts_service_1.AccountsService,
        sites_service_1.SitesService,
        documents_service_1.DocumentsService])
], SearchService);
//# sourceMappingURL=search.service.js.map