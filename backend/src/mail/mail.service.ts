import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
        auth: {
      user: 'a32d8a001@smtp-brevo.com',
      pass: 'xsmtpsib-76aaa32de13ea80654a04218bdaf72e8301641310b98c4b209f434d16c476d9b-x12sZw9O9xvYFoIN',
    },
  });

  async sendVerificationEmail(email: string, token: string) {
    const verifyUrl = `http://localhost:3000/auth/verify-email?token=${token}`;
  
    console.log('Sending email to:', email); // ← add this
    console.log('Verify URL:', verifyUrl);   // ← add this
  
    const info = await this.transporter.sendMail({
      from: `"BI Platform" <tenexa63@gmail.com>`,
      to: email,
      subject: 'Verify your email',
      html: `
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
    });
  
    console.log('Email sent:', info.messageId); // ← add this
  }
}