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
exports.SnapshotSchema = exports.Snapshot = exports.SnapshotStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var SnapshotStatus;
(function (SnapshotStatus) {
    SnapshotStatus["PENDING"] = "PENDING";
    SnapshotStatus["RUNNING"] = "RUNNING";
    SnapshotStatus["COMPLETED"] = "COMPLETED";
    SnapshotStatus["FAILED"] = "FAILED";
})(SnapshotStatus || (exports.SnapshotStatus = SnapshotStatus = {}));
let Snapshot = class Snapshot {
};
exports.Snapshot = Snapshot;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Site', required: true, index: true }),
    __metadata("design:type", String)
], Snapshot.prototype, "siteId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: SnapshotStatus, default: SnapshotStatus.PENDING }),
    __metadata("design:type", String)
], Snapshot.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Snapshot.prototype, "pagesVisitedCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: Date.now }),
    __metadata("design:type", Date)
], Snapshot.prototype, "startedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Date)
], Snapshot.prototype, "finishedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Snapshot.prototype, "error", void 0);
exports.Snapshot = Snapshot = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Snapshot);
exports.SnapshotSchema = mongoose_1.SchemaFactory.createForClass(Snapshot);
//# sourceMappingURL=snapshot.schema.js.map