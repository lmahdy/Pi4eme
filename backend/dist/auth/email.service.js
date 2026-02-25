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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
let EmailService = EmailService_1 = class EmailService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(EmailService_1.name);
        this.transporter = null;
        const host = this.configService.get('SMTP_HOST');
        const port = Number(this.configService.get('SMTP_PORT') || 587);
        const user = this.configService.get('SMTP_USER');
        const pass = this.configService.get('SMTP_PASS');
        this.fromAddress =
            this.configService.get('MAIL_FROM') || 'no-reply@tenexa.local';
        if (host && user && pass) {
            this.transporter = nodemailer.createTransport({
                host,
                port,
                secure: port === 465,
                auth: { user, pass },
            });
        }
        else {
            this.logger.warn('SMTP configuration is missing. Email notifications will be logged to the console only.');
        }
    }
    async sendPasswordReset(to, resetUrl) {
        const subject = 'Tenexa – Password reset request';
        const text = `You requested to reset your Tenexa password.\n\nClick the secure link below to choose a new password:\n\n${resetUrl}\n\nIf you did not request this, you can safely ignore this email.`;
        const html = `<p>You requested to reset your <strong>Tenexa</strong> password.</p>
<p>Click the secure link below to choose a new password:</p>
<p><a href="${resetUrl}" target="_blank" rel="noopener noreferrer">${resetUrl}</a></p>
<p>If you did not request this, you can safely ignore this email.</p>`;
        if (!this.transporter) {
            this.logger.log(`Password reset link for ${to}: ${resetUrl} (email not sent – SMTP not configured)`);
            return;
        }
        await this.transporter.sendMail({
            to,
            from: this.fromAddress,
            subject,
            text,
            html,
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map