import { Document, Schema as MongooseSchema } from 'mongoose';
export type SnapshotDocument = Snapshot & Document;
export declare enum SnapshotStatus {
    PENDING = "PENDING",
    RUNNING = "RUNNING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}
export declare class Snapshot {
    siteId: string;
    status: SnapshotStatus;
    pagesVisitedCount: number;
    startedAt: Date;
    finishedAt?: Date;
    error?: string;
}
export declare const SnapshotSchema: MongooseSchema<Snapshot, import("mongoose").Model<Snapshot, any, any, any, Document<unknown, any, Snapshot, any, {}> & Snapshot & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Snapshot, Document<unknown, {}, import("mongoose").FlatRecord<Snapshot>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Snapshot> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
