import { Injectable } from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';
import { SitesService } from '../sites/sites.service';
import { SnapshotsService } from '../snapshots/snapshots.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly sitesService: SitesService,
    private readonly snapshotsService: SnapshotsService,
  ) {}

  async runSeed() {
    // 1. Crear o buscar cuenta de ejemplo
    let account;
    const allAccounts = await this.accountsService.findAll();
    if (allAccounts.length > 0) {
      account = allAccounts[0];
    } else {
      account = await this.accountsService.create({
        name: 'Cliente Demo Corporativo',
        email: 'demo@corporativo.com',
      });
    }

    // 2. Buscar o crear sitio de ejemplo
    const accountId = (account as any)._id.toString();
    const existingSites = await this.sitesService.findByAccount(accountId);
    let site;
    if (existingSites.length > 0) {
      site = existingSites[0];
    } else {
      site = await this.sitesService.create({
        accountId,
        name: 'Sitio Web de Ejemplo ACME',
        url: 'https://example.com',
        maxDepth: 3,
        frequency: '0 0 * * *',
        documentExtractor: `function extract(request, response) { return [{ name: $('title').text(), url: request.url, description: $('meta[name="description"]').attr('content') }]; }`,
        pageResolver: `function pageResolver(request, response) { let links = []; $('a').each((i, el) => links.push($(el).attr('href'))); return links; }`,
      });
    }

    const siteId = (site as any)._id.toString();

    // 3. Disparar snapshot/crawl
    const snapshot = await this.snapshotsService.triggerCrawl(siteId);

    return {
      message: 'Seed ejecutado exitosamente con datos de demostración.',
      account: {
        id: accountId,
        name: account.name,
        email: account.email,
        apiKey: account.apiKey,
      },
      site: {
        id: siteId,
        name: site.name,
        url: site.url,
      },
      snapshotId: (snapshot as any)._id,
      instructions: `Usa la API Key '${account.apiKey}' para probar el endpoint /search?q=ejemplo&apiKey=${account.apiKey}`,
    };
  }
}
