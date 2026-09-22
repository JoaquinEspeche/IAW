import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExtractedDocument, ExtractedDocumentDocument } from './schemas/extracted-document.schema';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(ExtractedDocument.name)
    private readonly extractedDocumentModel: Model<ExtractedDocumentDocument>,
  ) {}

  async create(doc: Partial<ExtractedDocument>): Promise<ExtractedDocumentDocument> {
    const created = new this.extractedDocumentModel(doc);
    return created.save();
  }

  async findBySnapshot(snapshotId: string): Promise<ExtractedDocument[]> {
    return this.extractedDocumentModel.find({ snapshotId }).exec();
  }

  async findBySite(siteId: string): Promise<ExtractedDocument[]> {
    return this.extractedDocumentModel.find({ siteId }).exec();
  }

  async findOne(id: string): Promise<ExtractedDocument> {
    const doc = await this.extractedDocumentModel.findById(id).exec();
    if (!doc) {
      throw new NotFoundException(`Document ${id} not found`);
    }
    return doc;
  }

  async searchByText(siteIds: string[], keyphrase: string): Promise<ExtractedDocument[]> {
    if (!keyphrase || keyphrase.trim() === '') {
      return [];
    }

    const query: any = {};
    if (siteIds && siteIds.length > 0) {
      query.siteId = { $in: siteIds };
    }

    let results: ExtractedDocument[] = [];

    try {
      // Intenta primero la búsqueda nativa con el índice $text
      results = await this.extractedDocumentModel
        .find({
          ...query,
          $text: { $search: keyphrase },
        })
        .exec();
    } catch (err) {
      // Si el índice $text aún se está construyendo o falla, procede con fallback regex
    }

    if (!results || results.length === 0) {
      // Fallback con expresiones regulares insensibles a mayúsculas y minúsculas
      const regex = new RegExp(keyphrase, 'i');
      results = await this.extractedDocumentModel
        .find({
          ...query,
          $or: [
            { title: regex },
            { description: regex },
            { text: regex },
          ],
        })
        .exec();
    }

    return results;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.extractedDocumentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Document ${id} not found`);
    }
    return { message: `Document ${id} deleted` };
  }
}
