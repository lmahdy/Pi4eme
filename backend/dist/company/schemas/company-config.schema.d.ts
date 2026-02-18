import { Document } from 'mongoose';
export type CompanyConfigDocument = CompanyConfig & Document;
export declare class CompanyConfig {
    companyId: string;
    companyName: string;
    taxRate: number;
    currency: string;
    email: string;
}
export declare const CompanyConfigSchema: import("mongoose").Schema<CompanyConfig, import("mongoose").Model<CompanyConfig, any, any, any, Document<unknown, any, CompanyConfig, any, {}> & CompanyConfig & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CompanyConfig, Document<unknown, {}, import("mongoose").FlatRecord<CompanyConfig>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<CompanyConfig> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
