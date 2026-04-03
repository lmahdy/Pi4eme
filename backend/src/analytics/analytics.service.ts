import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Purchase, PurchaseDocument } from '../purchases/schemas/purchase.schema';
import { Sale, SaleDocument } from '../sales/schemas/sale.schema';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { CompanyConfig, CompanyConfigDocument } from '../company/schemas/company-config.schema';

@Injectable()
export class AnalyticsService {
    private readonly logger = new Logger(AnalyticsService.name);
    private readonly mlBaseUrl = process.env.ML_SERVICE_URL || 'http://localhost:5000';

    constructor(
        @InjectModel(Purchase.name)
        private readonly purchaseModel: Model<PurchaseDocument>,
        @InjectModel(Sale.name)
        private readonly saleModel: Model<SaleDocument>,
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
        @InjectModel(CompanyConfig.name)
        private readonly companyModel: Model<CompanyConfigDocument>,
    ) { }

    private toQueryId(id: string) {
        if (!id) return null;
        if (Types.ObjectId.isValid(id)) return new Types.ObjectId(id);
        return id;
    }

    /** Fetch purchases + sales for a company, POST to Python ML, return result */
    private async callMl(companyId: string, endpoint: string): Promise<any> {
        const qid = this.toQueryId(companyId);
        const [purchases, sales] = await Promise.all([
            this.purchaseModel.find({ companyId: qid }).lean().exec(),
            this.saleModel.find({ companyId: qid }).lean().exec(),
        ]);

        const url = `${this.mlBaseUrl}${endpoint}`;
        this.logger.log(`Calling ML service: ${url} (${purchases.length} purchases, ${sales.length} sales)`);

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ purchases, sales }),
        });

        if (!response.ok) {
            const text = await response.text();
            this.logger.error(`ML service error: ${response.status} ${text}`);
            throw new Error(`ML service returned ${response.status}`);
        }

        return response.json();
    }

    async getStockoutRisks(companyId: string) {
        try {
            return await this.callMl(companyId, '/ml/stockout');
        } catch (e) {
            this.logger.error('Stockout prediction failed', e);
            return [];
        }
    }

    async getHealthScore(companyId: string) {
        try {
            return await this.callMl(companyId, '/ml/health-score');
        } catch (e) {
            this.logger.error('Health score failed', e);
            return { score: 0, status: 'Error', explanation: 'ML service unavailable', factors: [] };
        }
    }

    async getSalesForecast(companyId: string) {
        try {
            return await this.callMl(companyId, '/ml/forecast');
        } catch (e) {
            this.logger.error('Forecast failed', e);
            return { actual: [], forecast: [], trend: 'Error', nextWeekTotal: 0, confidence: 0 };
        }
    }

    async getProductPerformance(companyId: string) {
        try {
            return await this.callMl(companyId, '/ml/product-performance');
        } catch (e) {
            this.logger.error('Product performance failed', e);
            return [];
        }
    }

    async getCompanyOverview(companyId: string) {
        try {
            const qid = this.toQueryId(companyId);
            if (!qid) return null;
            
            const [userCount, company, purchases, sales, customers] = await Promise.all([
                this.userModel.countDocuments({ companyId: qid }).exec(),
                this.companyModel.findOne({ companyId: qid }).lean().exec(),
                this.purchaseModel.find({ companyId: qid }).lean().exec(),
                this.saleModel.find({ companyId: qid }).lean().exec(),
                this.saleModel.distinct('customer', { companyId: qid }).exec(),
            ]);

            const totalRevenue = sales.reduce((acc, s) => acc + (s.totalAmount || 0), 0);
            const totalCosts = purchases.reduce((acc, p) => acc + (p.totalCost || 0), 0);
            const profit = totalRevenue - totalCosts;

            // Group by product for Top 5
            const productMap = new Map<string, { quantity: number, revenue: number }>();
            sales.forEach(s => {
                const prod = s.product || 'Unknown';
                const current = productMap.get(prod) || { quantity: 0, revenue: 0 };
                current.quantity += s.quantity || 0;
                current.revenue += s.totalAmount || 0;
                productMap.set(prod, current);
            });

            const topProducts = Array.from(productMap.entries())
                .sort((a, b) => b[1].revenue - a[1].revenue)
                .slice(0, 5)
                .map(([name, stats]) => ({ name, ...stats }));

            // Top Customers
            const customerMap = new Map<string, { totalSpent: number, orders: number }>();
            sales.forEach(s => {
                const cust = s.customer || 'Unknown';
                const current = customerMap.get(cust) || { totalSpent: 0, orders: 0 };
                current.totalSpent += s.totalAmount || 0;
                current.orders += 1;
                customerMap.set(cust, current);
            });

            const topCustomers = Array.from(customerMap.entries())
                .sort((a, b) => b[1].totalSpent - a[1].totalSpent)
                .slice(0, 5)
                .map(([name, stats]) => ({ name, ...stats }));

            return {
                userCount,
                customerCount: customers.length,
                totalOrders: sales.length,
                totalPurchases: purchases.length,
                companyName: company?.companyName || 'Unknown',
                currency: company?.currency || 'USD',
                totalRevenue,
                totalCosts,
                profit,
                taxRate: company?.taxRate || 0,
                topProducts,
                topCustomers
            };
        } catch (e) {
            this.logger.error('Overview failed', e);
            return null;
        }
    }
}
