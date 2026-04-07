import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly apiKey: string;
  private readonly senderEmail: string;
  private readonly senderName: string;

  constructor() {
    this.apiKey = process.env.BREVO_API_KEY || '';
    this.senderEmail = process.env.MAIL_FROM || 'noreply@biplatform.com';
    this.senderName = 'BI Platform';

    if (!this.apiKey) {
      this.logger.warn('BREVO_API_KEY is not set! Emails will not be sent.');
    }
  }

  private async sendEmail(to: string, subject: string, htmlContent: string) {
    if (!this.apiKey) {
      this.logger.error('Cannot send email: BREVO_API_KEY is not configured');
      throw new Error('Email service is not configured');
    }

    try {
      const response = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
          sender: { email: this.senderEmail, name: this.senderName },
          to: [{ email: to }],
          subject,
          htmlContent,
        },
        {
          headers: {
            'api-key': this.apiKey,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      this.logger.log(`Email sent to ${to} - messageId: ${response.data?.messageId}`);
      return response.data;
    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.message;
      this.logger.error(`Failed to send email to ${to}: ${errMsg}`);
      throw new Error(`Failed to send email: ${errMsg}`);
    }
  }

  async sendVerificationEmail(email: string, token: string) {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    const verifyUrl = `${backendUrl}/auth/verify-email?token=${token}`;

    await this.sendEmail(
      email,
      'Verify your email',
      `
  <h2>Welcome to BI Platform!</h2>
  <p>Click the button below to verify your email:</p>
  <a href="${verifyUrl}" style="
    background-color: #4f46e5;
    color: white;
    padding: 12px 24px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: bold;
  ">Verify Email</a>
  <p>This link expires in 24 hours.</p>
`,
    );
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    await this.sendEmail(
      email,
      'Reset Your Password',
      `
  <h2>Password Reset Request</h2>
  <p>You requested to reset your password. Click the button below to choose a new password:</p>
  <a href="${resetUrl}" style="
    background-color: #4f46e5;
    color: white;
    padding: 12px 24px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: bold;
    display: inline-block;
    margin-top: 10px;
  ">Reset Password</a>
  <p style="margin-top: 20px; font-size: 12px; color: #666;">If you didn't request this, you can safely ignore this email. This link expires in 1 hour.</p>
`,
    );
  }
}
