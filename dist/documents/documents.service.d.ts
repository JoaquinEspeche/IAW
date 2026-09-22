import { Model } from 'mongoose';
import { ExtractedDocument, ExtractedDocumentDocument } from './schemas/extracted-document.schema';
export declare class DocumentsService {
    private readonly extractedDocumentModel;
    constructor(extractedDocumentModel: Model<ExtractedDocumentDocument>);
    create(doc: Partial<ExtractedDocument>): Promise<ExtractedDocumentDocument>;
    findBySnapshot(snapshotId: string): Promise<ExtractedDocument[]>;
    findBySite(siteId: string): Promise<ExtractedDocument[]>;
    findOne(id: string): Promise<ExtractedDocument>;
    searchByText(siteIds: string[], keyphrase: string): Promise<ExtractedDocument[]>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
