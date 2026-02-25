import { BadRequestException, Injectable, Logger, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { SignupDto } from './dto/signup.dto';
import { UserRole } from './roles.enum';
import { CompanyConfig, CompanyConfigDocument } from '../company/schemas/company-config.schema';
import { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  companyId: string;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(CompanyConfig.name) private companyModel: Model<CompanyConfigDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) { }

  async onModuleInit() {
    const adminExists = await this.userModel.exists({ role: UserRole.Admin });
    if (!adminExists) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      await this.userModel.create({
        email: 'admin@bi.platform',
        name: 'System Admin',
        passwordHash,
        role: UserRole.Admin,
        companyId: 'SYSTEM',
        status: 'active',
      });
    }
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email: email.toLowerCase() }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        status: user.status,
      },
    };
  }

  async signup(dto: SignupDto) {
    const email = dto.email.toLowerCase();
    const existing = await this.userModel.exists({ email });
    if (existing) {
      throw new BadRequestException('Email address is already registered');
    }

    let companyId: string;
    if (dto.role === UserRole.CompanyOwner) {
      if (!dto.companyName || dto.taxRate === undefined || dto.currency === undefined) {
        throw new BadRequestException('companyName, taxRate, and currency are required when role is CompanyOwner');
      }
      companyId = new Types.ObjectId().toHexString();
      await this.companyModel.create({
        companyId,
        companyName: dto.companyName,
        taxRate: dto.taxRate,
        currency: dto.currency,
        email: dto.notificationEmail || email,
      });
    } else {
      if (!dto.companyId) {
        throw new BadRequestException('companyId is required when role is Accountant');
      }
      const companyExists = await this.companyModel.exists({ companyId: dto.companyId });
      if (!companyExists) {
        throw new BadRequestException('Company with the given companyId was not found');
      }
      companyId = dto.companyId;
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({
      companyId,
      name: dto.name,
      email,
      passwordHash,
      role: dto.role,
      status: 'active',
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        status: user.status,
      },
    };
  }

  async requestPasswordReset(email: string) {
    const normalizedEmail = email.toLowerCase();
    const user = await this.userModel.findOne({ email: normalizedEmail }).exec();

    // Do not reveal whether the user exists to avoid account enumeration
    if (!user) {
      return;
    }

    const token = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        purpose: 'password_reset',
      },
      { expiresIn: '15m' },
    );

    const frontendBase =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:4200';
    const resetUrl = `${frontendBase.replace(/\/$/, '')}/reset-password?token=${token}`;

    try {
      await this.emailService.sendPasswordReset(user.email, resetUrl);
    } catch (err) {
      this.logger.error(`Failed to send password reset email to ${user.email}: ${err?.message}`);
      // Do not surface email errors to the caller – the link was generated successfully
    }
  }

  async resetPassword(token: string, newPassword: string) {
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      throw new BadRequestException('Reset link is invalid or has expired');
    }

    if (payload.purpose !== 'password_reset' || !payload.sub) {
      throw new BadRequestException('Reset link is invalid or has expired');
    }

    const user = await this.userModel.findById(payload.sub).exec();
    if (!user) {
      throw new BadRequestException('Reset link is invalid or has expired');
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
  }
}
