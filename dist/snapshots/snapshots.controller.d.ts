import { SnapshotsService } from './snapshots.service';
import { Snapshot } from './schemas/snapshot.schema';
export declare class SnapshotsController {
    private readonly snapshotsService;
    constructor(snapshotsService: SnapshotsService);
    findBySite(siteId: string): Promise<Snapshot[]>;
    findOne(id: string): Promise<Snapshot>;
    triggerCrawl(siteId: string): Promise<Snapshot>;
}
