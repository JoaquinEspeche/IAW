import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SiteDocument = Site & Document;

@Schema({ timestamps: true })
export class Site {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Account', required: true, index: true })
  accountId: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  url: string;

  @Prop({ required: true, default: 2 })
  maxDepth: number;

  @Prop({ required: true, default: '0 0 * * *' })
  frequency: string;

  @Prop({ required: true })
  documentExtractor: string;

  @Prop({ required: false })
  pageResolver?: string;
}

export const SiteSchema = SchemaFactory.createForClass(Site);
