import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { SignupDto } from './dto/signup.dto';
import { UserRole } from './roles.enum';
import { CompanyConfigDocument } from '../company/schemas/company-config.schema';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    companyId: string;
}
export declare class AuthService implements OnModuleInit {
    private userModel;
    private companyModel;
    private jwtService;
    private configService;
    private emailService;
    private readonly logger;
    constructor(userModel: Model<UserDocument>, companyModel: Model<CompanyConfigDocument>, jwtService: JwtService, configService: ConfigService, emailService: EmailService);
    onModuleInit(): Promise<void>;
    login(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: any;
            name: string;
            email: string;
            role: UserRole;
            companyId: string;
            status: "active";
        };
    }>;
    signup(dto: SignupDto): Promise<{
        access_token: string;
        user: {
            id: any;
            name: string;
            email: string;
            role: UserRole;
            companyId: string;
            status: "active" | "inactive";
        };
    }>;
    requestPasswordReset(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
}
