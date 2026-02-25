import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
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
        message: string;
    }>;
    githubLogin(): void;
    githubCallback(req: any, res: any): Promise<void>;
    verifyEmail(token: string, res: any): Promise<void>;
}
