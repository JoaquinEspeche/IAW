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
exports.SitesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sites_service_1 = require("./sites.service");
const create_site_dto_1 = require("./dto/create-site.dto");
const update_site_dto_1 = require("./dto/update-site.dto");
let SitesController = class SitesController {
    constructor(sitesService) {
        this.sitesService = sitesService;
    }
    create(createSiteDto) {
        return this.sitesService.create(createSiteDto);
    }
    findAll(accountId) {
        if (accountId) {
            return this.sitesService.findByAccount(accountId);
        }
        return this.sitesService.findAll();
    }
    findOne(id) {
        return this.sitesService.findOne(id);
    }
    update(id, updateSiteDto) {
        return this.sitesService.update(id, updateSiteDto);
    }
    remove(id) {
        return this.sitesService.remove(id);
    }
};
exports.SitesController = SitesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar un nuevo sitio a inspeccionar' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Sitio registrado exitosamente.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_site_dto_1.CreateSiteDto]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos los sitios' }),
    (0, swagger_1.ApiQuery)({ name: 'accountId', required: false, description: 'Filtrar por ID de cuenta' }),
    __param(0, (0, common_1.Query)('accountId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener información detallada de un sitio' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del sitio' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar la configuración de un sitio' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del sitio' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_site_dto_1.UpdateSiteDto]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un sitio' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del sitio' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SitesController.prototype, "remove", null);
exports.SitesController = SitesController = __decorate([
    (0, swagger_1.ApiTags)('Sites'),
    (0, common_1.Controller)('sites'),
    __metadata("design:paramtypes", [sites_service_1.SitesService])
], SitesController);
//# sourceMappingURL=sites.controller.js.map