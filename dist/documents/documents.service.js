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
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const extracted_document_schema_1 = require("./schemas/extracted-document.schema");
let DocumentsService = class DocumentsService {
    constructor(extractedDocumentModel) {
        this.extractedDocumentModel = extractedDocumentModel;
    }
    async create(doc) {
        const created = new this.extractedDocumentModel(doc);
        return created.save();
    }
    async findBySnapshot(snapshotId) {
        return this.extractedDocumentModel.find({ snapshotId }).exec();
    }
    async findBySite(siteId) {
        return this.extractedDocumentModel.find({ siteId }).exec();
    }
    async findOne(id) {
        const doc = await this.extractedDocumentModel.findById(id).exec();
        if (!doc) {
            throw new common_1.NotFoundException(`Document ${id} not found`);
        }
        return doc;
    }
    async searchByText(siteIds, keyphrase) {
        if (!keyphrase || keyphrase.trim() === '') {
            return [];
        }
        const query = {};
        if (siteIds && siteIds.length > 0) {
            query.siteId = { $in: siteIds };
        }
        let results = [];
        try {
            results = await this.extractedDocumentModel
                .find({
                ...query,
                $text: { $search: keyphrase },
            })
                .exec();
        }
        catch (err) {
        }
        if (!results || results.length === 0) {
            const regex = new RegExp(keyphrase, 'i');
            results = await this.extractedDocumentModel
                .find({
                ...query,
                $or: [
                    { title: regex },
                    { description: regex },
                    { text: regex },
                ],
            })
                .exec();
        }
        return results;
    }
    async remove(id) {
        const result = await this.extractedDocumentModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Document ${id} not found`);
        }
        return { message: `Document ${id} deleted` };
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(extracted_document_schema_1.ExtractedDocument.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map