"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const snapshots_service_1 = require("./snapshots.service");
const snapshots_controller_1 = require("./snapshots.controller");
const snapshot_schema_1 = require("./schemas/snapshot.schema");
const sites_module_1 = require("../sites/sites.module");
const documents_module_1 = require("../documents/documents.module");
let SnapshotsModule = class SnapshotsModule {
};
exports.SnapshotsModule = SnapshotsModule;
exports.SnapshotsModule = SnapshotsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: snapshot_schema_1.Snapshot.name, schema: snapshot_schema_1.SnapshotSchema },
            ]),
            sites_module_1.SitesModule,
            documents_module_1.DocumentsModule,
        ],
        controllers: [snapshots_controller_1.SnapshotsController],
        providers: [snapshots_service_1.SnapshotsService],
        exports: [snapshots_service_1.SnapshotsService],
    })
], SnapshotsModule);
//# sourceMappingURL=snapshots.module.js.map