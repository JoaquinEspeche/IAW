import { DocumentsService } from './documents.service';
import { ExtractedDocument } from './schemas/extracted-document.schema';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    findBySnapshot(snapshotId: string): Promise<ExtractedDocument[]>;
    findBySite(siteId: string): Promise<ExtractedDocument[]>;
    findOne(id: string): Promise<ExtractedDocument>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
