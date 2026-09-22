import { AccountsService } from '../accounts/accounts.service';
import { SitesService } from '../sites/sites.service';
import { SnapshotsService } from '../snapshots/snapshots.service';
export declare class SeedService {
    private readonly accountsService;
    private readonly sitesService;
    private readonly snapshotsService;
    constructor(accountsService: AccountsService, sitesService: SitesService, snapshotsService: SnapshotsService);
    runSeed(): Promise<{
        message: string;
        account: {
            id: any;
            name: any;
            email: any;
            apiKey: any;
        };
        site: {
            id: any;
            name: any;
            url: any;
        };
        snapshotId: any;
        instructions: string;
    }>;
}
