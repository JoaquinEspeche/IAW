import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Site } from './schemas/site.schema';
export declare class SitesController {
    private readonly sitesService;
    constructor(sitesService: SitesService);
    create(createSiteDto: CreateSiteDto): Promise<Site>;
    findAll(accountId?: string): Promise<Site[]>;
    findOne(id: string): Promise<Site>;
    update(id: string, updateSiteDto: UpdateSiteDto): Promise<Site>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
