import { Model } from 'mongoose';
import { Snapshot, SnapshotDocument } from './schemas/snapshot.schema';
import { SitesService } from '../sites/sites.service';
import { DocumentsService } from '../documents/documents.service';
export declare class SnapshotsService {
    private readonly snapshotModel;
    private readonly sitesService;
    private readonly documentsService;
    constructor(snapshotModel: Model<SnapshotDocument>, sitesService: SitesService, documentsService: DocumentsService);
    findBySite(siteId: string): Promise<Snapshot[]>;
    findOne(id: string): Promise<Snapshot>;
    triggerCrawl(siteId: string): Promise<Snapshot>;
    private executeCrawl;
}
