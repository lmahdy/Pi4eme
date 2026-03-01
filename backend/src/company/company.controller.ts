import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyConfigDto } from './dto/company-config.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../auth/roles.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('company')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Post('config')
  @Roles(UserRole.CompanyOwner)
  async upsertConfig(
    @Body() dto: CompanyConfigDto,
    @CurrentUser() user: { companyId: string },
  ) {
    return this.companyService.upsertConfig(user.companyId, dto);
  }

  @Get('config')
  @Roles(UserRole.CompanyOwner, UserRole.Accountant)
  async getConfig(@CurrentUser() user: { companyId: string }) {
    return this.companyService.getConfig(user.companyId);
  }
}
