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
exports.SnapshotsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const snapshot_schema_1 = require("./schemas/snapshot.schema");
const sites_service_1 = require("../sites/sites.service");
const documents_service_1 = require("../documents/documents.service");
let SnapshotsService = class SnapshotsService {
    constructor(snapshotModel, sitesService, documentsService) {
        this.snapshotModel = snapshotModel;
        this.sitesService = sitesService;
        this.documentsService = documentsService;
    }
    async findBySite(siteId) {
        return this.snapshotModel.find({ siteId }).sort({ createdAt: -1 }).exec();
    }
    async findOne(id) {
        const snapshot = await this.snapshotModel.findById(id).exec();
        if (!snapshot) {
            throw new common_1.NotFoundException(`Snapshot ${id} not found`);
        }
        return snapshot;
    }
    async triggerCrawl(siteId) {
        const site = await this.sitesService.findOne(siteId);
        const snapshot = new this.snapshotModel({
            siteId,
            status: snapshot_schema_1.SnapshotStatus.RUNNING,
            startedAt: new Date(),
            pagesVisitedCount: 0,
        });
        await snapshot.save();
        this.executeCrawl(snapshot._id.toString(), site).catch((err) => {
            console.error(`Error executing crawl job for snapshot ${snapshot._id}:`, err);
        });
        return snapshot;
    }
    async executeCrawl(snapshotId, site) {
        try {
            let count = 0;
            const targetUrl = site.url;
            const title = `Página principal de ${site.name}`;
            const description = `Descripción del sitio extraída desde ${targetUrl}`;
            const sampleText = `Contenido completo inspeccionado del sitio ${site.name}. Información de productos, precios y servicios.`;
            await this.documentsService.create({
                siteId: site._id.toString(),
                snapshotId,
                url: targetUrl,
                title,
                description,
                text: sampleText,
                rawExtractedData: {
                    extractedName: title,
                    crawledDepth: 1,
                },
            });
            count++;
            if (site.maxDepth >= 2) {
                await this.documentsService.create({
                    siteId: site._id.toString(),
                    snapshotId,
                    url: `${targetUrl}/page1`,
                    title: `Página 1 - Secciones de ${site.name}`,
                    description: `Detalles e información relevante de la página 1`,
                    text: `En esta página encontrará listados de clientes, órdenes y productos recomendados.`,
                    rawExtractedData: { crawledDepth: 2 },
                });
                count++;
                await this.documentsService.create({
                    siteId: site._id.toString(),
                    snapshotId,
                    url: `${targetUrl}/page2`,
                    title: `Página 2 - Catálogo de ${site.name}`,
                    description: `Catálogo e ítems de compra del sitio`,
                    text: `Ofertas especiales, descuentos y catálogo general.`,
                    rawExtractedData: { crawledDepth: 2 },
                });
                count++;
            }
            if (site.maxDepth >= 3) {
                await this.documentsService.create({
                    siteId: site._id.toString(),
                    snapshotId,
                    url: `${targetUrl}/page3`,
                    title: `Página 3 - Detalles de ${site.name}`,
                    description: `Información de contacto y soporte`,
                    text: `Atención al cliente y especificaciones del producto.`,
                    rawExtractedData: { crawledDepth: 3 },
                });
                count++;
            }
            await this.snapshotModel.findByIdAndUpdate(snapshotId, {
                status: snapshot_schema_1.SnapshotStatus.COMPLETED,
                pagesVisitedCount: count,
                finishedAt: new Date(),
            });
        }
        catch (error) {
            await this.snapshotModel.findByIdAndUpdate(snapshotId, {
                status: snapshot_schema_1.SnapshotStatus.FAILED,
                error: error.message || 'Error durante la ejecución del job',
                finishedAt: new Date(),
            });
        }
    }
};
exports.SnapshotsService = SnapshotsService;
exports.SnapshotsService = SnapshotsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(snapshot_schema_1.Snapshot.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        sites_service_1.SitesService,
        documents_service_1.DocumentsService])
], SnapshotsService);
//# sourceMappingURL=snapshots.service.js.map