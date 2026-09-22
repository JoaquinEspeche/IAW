import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ExtractedDocumentDocument = ExtractedDocument & Document;

@Schema({ timestamps: true })
export class ExtractedDocument {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Site', required: true, index: true })
  siteId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Snapshot', required: true, index: true })
  snapshotId: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: false, default: '' })
  description: string;

  @Prop({ required: false, default: '' })
  text: string;

  @Prop({ type: MongooseSchema.Types.Mixed, required: false })
  rawExtractedData?: Record<string, any>;
}

export const ExtractedDocumentSchema = SchemaFactory.createForClass(ExtractedDocument);

// Definir índice de texto de MongoDB para optimizar las búsquedas por keyphrase ($text)
ExtractedDocumentSchema.index(
  { title: 'text', description: 'text', text: 'text' },
  { weights: { title: 10, description: 5, text: 1 }, name: 'TextSearchIndex' }
);
