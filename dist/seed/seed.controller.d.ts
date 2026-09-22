import { SeedService } from './seed.service';
export declare class SeedController {
    private readonly seedService;
    constructor(seedService: SeedService);
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
