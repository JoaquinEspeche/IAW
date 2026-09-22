import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';
import { SitesService } from '../sites/sites.service';
import { DocumentsService } from '../documents/documents.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly sitesService: SitesService,
    private readonly documentsService: DocumentsService,
  ) {}

  async search(keyphrase: string, apiKey?: string) {
    if (!apiKey) {
      throw new UnauthorizedException('API Key es requerida para realizar búsquedas');
    }

    const account = await this.accountsService.findByApiKey(apiKey);
    if (!account) {
      throw new UnauthorizedException('API Key inválida o no registrada');
    }

    // Obtener los sitios pertenecientes a la cuenta
    const sites = await this.sitesService.findByAccount(account._id.toString());
    const siteIds = sites.map((s: any) => s._id.toString());

    // Buscar en MongoDB por la keyphrase dada
    return this.documentsService.searchByText(siteIds, keyphrase);
  }
}
