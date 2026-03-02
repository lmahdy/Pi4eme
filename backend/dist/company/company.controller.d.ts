import { CompanyService } from './company.service';
import { CompanyConfigDto } from './dto/company-config.dto';
export declare class CompanyController {
    private companyService;
    constructor(companyService: CompanyService);
    upsertConfig(dto: CompanyConfigDto, user: {
        companyId: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/company-config.schema").CompanyConfigDocument, {}, {}> & import("./schemas/company-config.schema").CompanyConfig & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getConfig(user: {
        companyId: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/company-config.schema").CompanyConfigDocument, {}, {}> & import("./schemas/company-config.schema").CompanyConfig & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
