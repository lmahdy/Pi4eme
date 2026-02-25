import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { SignupDto } from './dto/signup.dto';
import { UserRole } from './roles.enum';
import { CompanyConfigDocument } from '../company/schemas/company-config.schema';
import { Types } from 'mongoose';
import { MailService } from '../mail/mail.service';
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
    private mailService;
    constructor(userModel: Model<UserDocument>, companyModel: Model<CompanyConfigDocument>, jwtService: JwtService, mailService: MailService);
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
        message: string;
    }>;
    findOrCreateGithubUser(profile: any): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    loginGithubUser(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            companyId: any;
            status: any;
        };
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
}
