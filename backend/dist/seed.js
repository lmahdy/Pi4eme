"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
async function seedCompany() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bi_platform');
        const CompanyModel = mongoose.model('CompanyConfig', new mongoose.Schema({
            companyId: String,
            companyName: String,
            taxRate: Number,
            currency: String,
            email: String,
        }, { collection: 'company_config' }));
        const company = {
            companyId: 'demo-company-1',
            companyName: 'Demo Company 1',
            taxRate: 20,
            currency: 'USD',
            email: 'demo@company.com',
        };
        const exists = await CompanyModel.exists({ companyId: company.companyId });
        if (!exists) {
            await CompanyModel.create(company);
            console.log('Created company: demo-company-1');
        }
        else {
            console.log('Company already exists');
        }
        await mongoose.disconnect();
    }
    catch (error) {
        console.error('Error:', error);
    }
}
seedCompany();
//# sourceMappingURL=seed.js.map