import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Purchase, PurchaseSchema } from '../purchases/schemas/purchase.schema';
import { Sale, SaleSchema } from '../sales/schemas/sale.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { CompanyConfig, CompanyConfigSchema } from '../company/schemas/company-config.schema';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Purchase.name, schema: PurchaseSchema },
            { name: Sale.name, schema: SaleSchema },
            { name: User.name, schema: UserSchema },
            { name: CompanyConfig.name, schema: CompanyConfigSchema },
        ]),
    ],
    controllers: [AnalyticsController],
    providers: [AnalyticsService],
    exports: [AnalyticsService],
})
export class AnalyticsModule { }
