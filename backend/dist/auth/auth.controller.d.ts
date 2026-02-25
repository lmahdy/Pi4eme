import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            name: string;
            email: string;
            role: import("./roles.enum").UserRole;
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
            role: import("./roles.enum").UserRole;
            companyId: string;
            status: "active" | "inactive";
        };
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
