export declare class MailService {
    private transporter;
    sendVerificationEmail(email: string, token: string): Promise<void>;
}
