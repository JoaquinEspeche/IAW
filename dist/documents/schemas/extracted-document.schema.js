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
exports.ExtractedDocumentSchema = exports.ExtractedDocument = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ExtractedDocument = class ExtractedDocument {
};
exports.ExtractedDocument = ExtractedDocument;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Site', required: true, index: true }),
    __metadata("design:type", String)
], ExtractedDocument.prototype, "siteId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Snapshot', required: true, index: true }),
    __metadata("design:type", String)
], ExtractedDocument.prototype, "snapshotId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ExtractedDocument.prototype, "url", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ExtractedDocument.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: '' }),
    __metadata("design:type", String)
], ExtractedDocument.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: '' }),
    __metadata("design:type", String)
], ExtractedDocument.prototype, "text", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.Mixed, required: false }),
    __metadata("design:type", Object)
], ExtractedDocument.prototype, "rawExtractedData", void 0);
exports.ExtractedDocument = ExtractedDocument = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ExtractedDocument);
exports.ExtractedDocumentSchema = mongoose_1.SchemaFactory.createForClass(ExtractedDocument);
exports.ExtractedDocumentSchema.index({ title: 'text', description: 'text', text: 'text' }, { weights: { title: 10, description: 5, text: 1 }, name: 'TextSearchIndex' });
//# sourceMappingURL=extracted-document.schema.js.map