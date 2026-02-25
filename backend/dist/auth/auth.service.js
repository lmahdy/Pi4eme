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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const user_schema_1 = require("./schemas/user.schema");
const roles_enum_1 = require("./roles.enum");
const company_config_schema_1 = require("../company/schemas/company-config.schema");
const mongoose_3 = require("mongoose");
const config_1 = require("@nestjs/config");
const email_service_1 = require("./email.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(userModel, companyModel, jwtService, configService, emailService) {
        this.userModel = userModel;
        this.companyModel = companyModel;
        this.jwtService = jwtService;
        this.configService = configService;
        this.emailService = emailService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async onModuleInit() {
        const adminExists = await this.userModel.exists({ role: roles_enum_1.UserRole.Admin });
        if (!adminExists) {
            const passwordHash = await bcrypt.hash('admin123', 10);
            await this.userModel.create({
                email: 'admin@bi.platform',
                name: 'System Admin',
                passwordHash,
                role: roles_enum_1.UserRole.Admin,
                companyId: 'SYSTEM',
                status: 'active',
            });
        }
    }
    async login(email, password) {
        const user = await this.userModel.findOne({ email: email.toLowerCase() }).exec();
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (user.status !== 'active') {
            throw new common_1.UnauthorizedException('Account is deactivated');
        }
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            companyId: user.companyId,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyId: user.companyId,
                status: user.status,
            },
        };
    }
    async signup(dto) {
        const email = dto.email.toLowerCase();
        const existing = await this.userModel.exists({ email });
        if (existing) {
            throw new common_1.BadRequestException('Email address is already registered');
        }
        let companyId;
        if (dto.role === roles_enum_1.UserRole.CompanyOwner) {
            if (!dto.companyName || dto.taxRate === undefined || dto.currency === undefined) {
                throw new common_1.BadRequestException('companyName, taxRate, and currency are required when role is CompanyOwner');
            }
            companyId = new mongoose_3.Types.ObjectId().toHexString();
            await this.companyModel.create({
                companyId,
                companyName: dto.companyName,
                taxRate: dto.taxRate,
                currency: dto.currency,
                email: dto.notificationEmail || email,
            });
        }
        else {
            if (!dto.companyId) {
                throw new common_1.BadRequestException('companyId is required when role is Accountant');
            }
            const companyExists = await this.companyModel.exists({ companyId: dto.companyId });
            if (!companyExists) {
                throw new common_1.BadRequestException('Company with the given companyId was not found');
            }
            companyId = dto.companyId;
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.userModel.create({
            companyId,
            name: dto.name,
            email,
            passwordHash,
            role: dto.role,
            status: 'active',
        });
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            companyId: user.companyId,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyId: user.companyId,
                status: user.status,
            },
        };
    }
    async requestPasswordReset(email) {
        const normalizedEmail = email.toLowerCase();
        const user = await this.userModel.findOne({ email: normalizedEmail }).exec();
        if (!user) {
            return;
        }
        const token = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            role: user.role,
            companyId: user.companyId,
            purpose: 'password_reset',
        }, { expiresIn: '15m' });
        const frontendBase = this.configService.get('FRONTEND_URL') || 'http://localhost:4200';
        const resetUrl = `${frontendBase.replace(/\/$/, '')}/reset-password?token=${token}`;
        try {
            await this.emailService.sendPasswordReset(user.email, resetUrl);
        }
        catch (err) {
            this.logger.error(`Failed to send password reset email to ${user.email}: ${err?.message}`);
        }
    }
    async resetPassword(token, newPassword) {
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(token);
        }
        catch {
            throw new common_1.BadRequestException('Reset link is invalid or has expired');
        }
        if (payload.purpose !== 'password_reset' || !payload.sub) {
            throw new common_1.BadRequestException('Reset link is invalid or has expired');
        }
        const user = await this.userModel.findById(payload.sub).exec();
        if (!user) {
            throw new common_1.BadRequestException('Reset link is invalid or has expired');
        }
        user.passwordHash = await bcrypt.hash(newPassword, 10);
        await user.save();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(company_config_schema_1.CompanyConfig.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService,
        config_1.ConfigService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map