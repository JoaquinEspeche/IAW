import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    search(query: string, queryApiKey?: string, headerApiKey?: string, authHeader?: string): Promise<import("../documents/schemas/extracted-document.schema").ExtractedDocument[]>;
}
