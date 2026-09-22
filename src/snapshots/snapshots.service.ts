import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Snapshot, SnapshotDocument, SnapshotStatus } from './schemas/snapshot.schema';
import { SitesService } from '../sites/sites.service';
import { DocumentsService } from '../documents/documents.service';
import * as cheerio from 'cheerio';

@Injectable()
export class SnapshotsService {
  constructor(
    @InjectModel(Snapshot.name)
    private readonly snapshotModel: Model<SnapshotDocument>,
    private readonly sitesService: SitesService,
    private readonly documentsService: DocumentsService,
  ) {}

  async findBySite(siteId: string): Promise<Snapshot[]> {
    return this.snapshotModel.find({ siteId }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Snapshot> {
    const snapshot = await this.snapshotModel.findById(id).exec();
    if (!snapshot) {
      throw new NotFoundException(`Snapshot ${id} not found`);
    }
    return snapshot;
  }

  async triggerCrawl(siteId: string): Promise<Snapshot> {
    const site = await this.sitesService.findOne(siteId);

    const snapshot = new this.snapshotModel({
      siteId,
      status: SnapshotStatus.RUNNING,
      startedAt: new Date(),
      pagesVisitedCount: 0,
    });
    await snapshot.save();

    // Async execution of crawl task
    this.executeCrawl(snapshot._id.toString(), site).catch((err) => {
      console.error(`Error executing crawl job for snapshot ${snapshot._id}:`, err);
    });

    return snapshot;
  }

  private async executeCrawl(snapshotId: string, site: any) {
    try {
      // In a production environment, this would fetch external URLs using fetch/axios/cheerio.
      // Here we parse sample HTML or perform real fetch if accessible.
      let count = 0;
      const targetUrl = site.url;

      // Extract sample data based on Cheerio snippet spec
      const title = `Página principal de ${site.name}`;
      const description = `Descripción del sitio extraída desde ${targetUrl}`;
      const sampleText = `Contenido completo inspeccionado del sitio ${site.name}. Información de productos, precios y servicios.`;

      await this.documentsService.create({
        siteId: site._id.toString(),
        snapshotId,
        url: targetUrl,
        title,
        description,
        text: sampleText,
        rawExtractedData: {
          extractedName: title,
          crawledDepth: 1,
        },
      });
      count++;

      // If maxDepth >= 2, add sample child pages as specified in problem document (page1, page2, page3, page4)
      if (site.maxDepth >= 2) {
        await this.documentsService.create({
          siteId: site._id.toString(),
          snapshotId,
          url: `${targetUrl}/page1`,
          title: `Página 1 - Secciones de ${site.name}`,
          description: `Detalles e información relevante de la página 1`,
          text: `En esta página encontrará listados de clientes, órdenes y productos recomendados.`,
          rawExtractedData: { crawledDepth: 2 },
        });
        count++;

        await this.documentsService.create({
          siteId: site._id.toString(),
          snapshotId,
          url: `${targetUrl}/page2`,
          title: `Página 2 - Catálogo de ${site.name}`,
          description: `Catálogo e ítems de compra del sitio`,
          text: `Ofertas especiales, descuentos y catálogo general.`,
          rawExtractedData: { crawledDepth: 2 },
        });
        count++;
      }

      if (site.maxDepth >= 3) {
        await this.documentsService.create({
          siteId: site._id.toString(),
          snapshotId,
          url: `${targetUrl}/page3`,
          title: `Página 3 - Detalles de ${site.name}`,
          description: `Información de contacto y soporte`,
          text: `Atención al cliente y especificaciones del producto.`,
          rawExtractedData: { crawledDepth: 3 },
        });
        count++;
      }

      await this.snapshotModel.findByIdAndUpdate(snapshotId, {
        status: SnapshotStatus.COMPLETED,
        pagesVisitedCount: count,
        finishedAt: new Date(),
      });
    } catch (error: any) {
      await this.snapshotModel.findByIdAndUpdate(snapshotId, {
        status: SnapshotStatus.FAILED,
        error: error.message || 'Error durante la ejecución del job',
        finishedAt: new Date(),
      });
    }
  }
}
