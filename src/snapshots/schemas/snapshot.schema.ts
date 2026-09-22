import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SnapshotDocument = Snapshot & Document;

export enum SnapshotStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Schema({ timestamps: true })
export class Snapshot {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Site', required: true, index: true })
  siteId: string;

  @Prop({ required: true, enum: SnapshotStatus, default: SnapshotStatus.PENDING })
  status: SnapshotStatus;

  @Prop({ required: true, default: 0 })
  pagesVisitedCount: number;

  @Prop({ required: true, default: Date.now })
  startedAt: Date;

  @Prop({ required: false })
  finishedAt?: Date;

  @Prop({ required: false })
  error?: string;
}

export const SnapshotSchema = SchemaFactory.createForClass(Snapshot);
