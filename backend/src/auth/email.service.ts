import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private readonly fromAddress: string;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(this.configService.get<string>('SMTP_PORT') || 587);
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');
    this.fromAddress =
      this.configService.get<string>('MAIL_FROM') || 'no-reply@tenexa.local';

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
    } else {
      this.logger.warn(
        'SMTP configuration is missing. Email notifications will be logged to the console only.',
      );
    }
  }

  async sendPasswordReset(to: string, resetUrl: string) {
    const subject = 'Tenexa – Password reset request';
    const text = `You requested to reset your Tenexa password.\n\nClick the secure link below to choose a new password:\n\n${resetUrl}\n\nIf you did not request this, you can safely ignore this email.`;

    const html = `<p>You requested to reset your <strong>Tenexa</strong> password.</p>
<p>Click the secure link below to choose a new password:</p>
<p><a href="${resetUrl}" target="_blank" rel="noopener noreferrer">${resetUrl}</a></p>
<p>If you did not request this, you can safely ignore this email.</p>`;

    if (!this.transporter) {
      this.logger.log(
        `Password reset link for ${to}: ${resetUrl} (email not sent – SMTP not configured)`,
      );
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
}

