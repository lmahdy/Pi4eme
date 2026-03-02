"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const company_config_schema_1 = require("./schemas/company-config.schema");
let CompanyService = class CompanyService {
    constructor(companyModel) {
        this.companyModel = companyModel;
    }
    async upsertConfig(companyId, dto) {
        return this.companyModel
            .findOneAndUpdate({ companyId }, { ...dto, companyId }, { upsert: true, new: true })
            .exec();
    }
    async getConfig(companyId) {
        return this.companyModel.findOne({ companyId }).exec();
    }
};
exports.CompanyService = CompanyService;
exports.CompanyService = CompanyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(company_config_schema_1.CompanyConfig.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CompanyService);
//# sourceMappingURL=company.service.js.map