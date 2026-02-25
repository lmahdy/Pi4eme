import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private readonly configService;
    private readonly logger;
    private transporter;
    private readonly fromAddress;
    constructor(configService: ConfigService);
    sendPasswordReset(to: string, resetUrl: string): Promise<void>;
}
