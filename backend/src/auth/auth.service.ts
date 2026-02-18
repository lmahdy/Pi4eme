import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { SignupDto } from './dto/signup.dto';
import { UserRole } from './roles.enum';
import { CompanyConfig, CompanyConfigDocument } from '../company/schemas/company-config.schema';
import { Types } from 'mongoose';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  companyId: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(CompanyConfig.name) private companyModel: Model<CompanyConfigDocument>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email: email.toLowerCase() }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
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
        email: user.email,
        role: user.role,
        companyId: user.companyId,
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
      email,
      passwordHash,
      role: dto.role,
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
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
    };
  }
}
