import { Document, Schema as MongooseSchema } from 'mongoose';
export type ExtractedDocumentDocument = ExtractedDocument & Document;
export declare class ExtractedDocument {
    siteId: string;
    snapshotId: string;
    url: string;
    title: string;
    description: string;
    text: string;
    rawExtractedData?: Record<string, any>;
}
export declare const ExtractedDocumentSchema: MongooseSchema<ExtractedDocument, import("mongoose").Model<ExtractedDocument, any, any, any, Document<unknown, any, ExtractedDocument, any, {}> & ExtractedDocument & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ExtractedDocument, Document<unknown, {}, import("mongoose").FlatRecord<ExtractedDocument>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<ExtractedDocument> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
