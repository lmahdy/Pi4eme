import { IsEmail, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CompanyConfigDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsNumber()
  @Min(0)
  taxRate: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsEmail()
  email: string;
}
