import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { CompanyConfig, CompanyConfigSchema } from './schemas/company-config.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CompanyConfig.name, schema: CompanyConfigSchema }]),
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService, MongooseModule],
})
export class CompanyModule {}
