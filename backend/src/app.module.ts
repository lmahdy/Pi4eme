import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { SalesModule } from './sales/sales.module';
import { PurchasesModule } from './purchases/purchases.module';
import { InventoryModule } from './inventory/inventory.module';
import { ReportModule } from './report/report.module';
import { AiModule } from './ai/ai.module';
import { MlModule } from './ml/ml.module';
import { SeedModule } from './seed/seed.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/bi_platform'),
    AuthModule,
    CompanyModule,
    ProductsModule,
    SalesModule,
    PurchasesModule,
    InventoryModule,
    ReportModule,
    MlModule,
    AiModule,
    SeedModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
