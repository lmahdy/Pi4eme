import { UserRole } from '../roles.enum';
export declare class SignupDto {
    email: string;
    password: string;
    role: UserRole;
    companyName?: string;
    taxRate?: number;
    currency?: string;
    notificationEmail?: string;
    companyId?: string;
}
