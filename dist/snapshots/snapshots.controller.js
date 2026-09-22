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
exports.SnapshotsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const snapshots_service_1 = require("./snapshots.service");
let SnapshotsController = class SnapshotsController {
    constructor(snapshotsService) {
        this.snapshotsService = snapshotsService;
    }
    findBySite(siteId) {
        return this.snapshotsService.findBySite(siteId);
    }
    findOne(id) {
        return this.snapshotsService.findOne(id);
    }
    triggerCrawl(siteId) {
        return this.snapshotsService.triggerCrawl(siteId);
    }
};
exports.SnapshotsController = SnapshotsController;
__decorate([
    (0, common_1.Get)('site/:siteId'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar capturas/snapshots realizadas a un sitio' }),
    (0, swagger_1.ApiParam)({ name: 'siteId', description: 'ID del sitio' }),
    __param(0, (0, common_1.Param)('siteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SnapshotsController.prototype, "findBySite", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener estado y detalle de una captura/snapshot' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del snapshot' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SnapshotsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('site/:siteId/trigger'),
    (0, swagger_1.ApiOperation)({ summary: 'Disparar manualmente un job de crawling (Generar Snapshot)' }),
    (0, swagger_1.ApiParam)({ name: 'siteId', description: 'ID del sitio a inspeccionar' }),
    __param(0, (0, common_1.Param)('siteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SnapshotsController.prototype, "triggerCrawl", null);
exports.SnapshotsController = SnapshotsController = __decorate([
    (0, swagger_1.ApiTags)('Snapshots / Crawling Jobs'),
    (0, common_1.Controller)('snapshots'),
    __metadata("design:paramtypes", [snapshots_service_1.SnapshotsService])
], SnapshotsController);
//# sourceMappingURL=snapshots.controller.js.map