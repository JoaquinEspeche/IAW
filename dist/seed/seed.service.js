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
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const accounts_service_1 = require("../accounts/accounts.service");
const sites_service_1 = require("../sites/sites.service");
const snapshots_service_1 = require("../snapshots/snapshots.service");
let SeedService = class SeedService {
    constructor(accountsService, sitesService, snapshotsService) {
        this.accountsService = accountsService;
        this.sitesService = sitesService;
        this.snapshotsService = snapshotsService;
    }
    async runSeed() {
        let account;
        const allAccounts = await this.accountsService.findAll();
        if (allAccounts.length > 0) {
            account = allAccounts[0];
        }
        else {
            account = await this.accountsService.create({
                name: 'Cliente Demo Corporativo',
                email: 'demo@corporativo.com',
            });
        }
        const accountId = account._id.toString();
        const existingSites = await this.sitesService.findByAccount(accountId);
        let site;
        if (existingSites.length > 0) {
            site = existingSites[0];
        }
        else {
            site = await this.sitesService.create({
                accountId,
                name: 'Sitio Web de Ejemplo ACME',
                url: 'https://example.com',
                maxDepth: 3,
                frequency: '0 0 * * *',
                documentExtractor: `function extract(request, response) { return [{ name: $('title').text(), url: request.url, description: $('meta[name="description"]').attr('content') }]; }`,
                pageResolver: `function pageResolver(request, response) { let links = []; $('a').each((i, el) => links.push($(el).attr('href'))); return links; }`,
            });
        }
        const siteId = site._id.toString();
        const snapshot = await this.snapshotsService.triggerCrawl(siteId);
        return {
            message: 'Seed ejecutado exitosamente con datos de demostración.',
            account: {
                id: accountId,
                name: account.name,
                email: account.email,
                apiKey: account.apiKey,
            },
            site: {
                id: siteId,
                name: site.name,
                url: site.url,
            },
            snapshotId: snapshot._id,
            instructions: `Usa la API Key '${account.apiKey}' para probar el endpoint /search?q=ejemplo&apiKey=${account.apiKey}`,
        };
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [accounts_service_1.AccountsService,
        sites_service_1.SitesService,
        snapshots_service_1.SnapshotsService])
], SeedService);
//# sourceMappingURL=seed.service.js.map