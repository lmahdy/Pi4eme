import { Model } from 'mongoose';
import { CompanyConfigDto } from './dto/company-config.dto';
import { CompanyConfig, CompanyConfigDocument } from './schemas/company-config.schema';
export declare class CompanyService {
    private companyModel;
    constructor(companyModel: Model<CompanyConfigDocument>);
    upsertConfig(companyId: string, dto: CompanyConfigDto): Promise<import("mongoose").Document<unknown, {}, CompanyConfigDocument, {}, {}> & CompanyConfig & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getConfig(companyId: string): Promise<import("mongoose").Document<unknown, {}, CompanyConfigDocument, {}, {}> & CompanyConfig & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
