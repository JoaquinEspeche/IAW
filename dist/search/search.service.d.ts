import { AccountsService } from '../accounts/accounts.service';
import { SitesService } from '../sites/sites.service';
import { DocumentsService } from '../documents/documents.service';
export declare class SearchService {
    private readonly accountsService;
    private readonly sitesService;
    private readonly documentsService;
    constructor(accountsService: AccountsService, sitesService: SitesService, documentsService: DocumentsService);
    search(keyphrase: string, apiKey?: string): Promise<import("../documents/schemas/extracted-document.schema").ExtractedDocument[]>;
}
