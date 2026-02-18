import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyConfigDto } from './dto/company-config.dto';
import { CompanyConfig, CompanyConfigDocument } from './schemas/company-config.schema';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(CompanyConfig.name)
    private companyModel: Model<CompanyConfigDocument>,
  ) {}

  async upsertConfig(companyId: string, dto: CompanyConfigDto) {
    return this.companyModel
      .findOneAndUpdate(
        { companyId },
        { ...dto, companyId },
        { upsert: true, new: true },
      )
      .exec();
  }

  async getConfig(companyId: string) {
    return this.companyModel.findOne({ companyId }).exec();
  }
}
