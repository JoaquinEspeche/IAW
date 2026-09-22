import { Model } from 'mongoose';
import { Site, SiteDocument } from './schemas/site.schema';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
export declare class SitesService {
    private readonly siteModel;
    constructor(siteModel: Model<SiteDocument>);
    create(createSiteDto: CreateSiteDto): Promise<Site>;
    findAll(): Promise<Site[]>;
    findByAccount(accountId: string): Promise<Site[]>;
    findOne(id: string): Promise<SiteDocument>;
    update(id: string, updateSiteDto: UpdateSiteDto): Promise<Site>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
