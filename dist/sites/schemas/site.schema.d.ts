import { Document, Schema as MongooseSchema } from 'mongoose';
export type SiteDocument = Site & Document;
export declare class Site {
    accountId: string;
    name: string;
    url: string;
    maxDepth: number;
    frequency: string;
    documentExtractor: string;
    pageResolver?: string;
}
export declare const SiteSchema: MongooseSchema<Site, import("mongoose").Model<Site, any, any, any, Document<unknown, any, Site, any, {}> & Site & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Site, Document<unknown, {}, import("mongoose").FlatRecord<Site>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Site> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
