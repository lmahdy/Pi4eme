import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }
  @Get('github')
@UseGuards(AuthGuard('github'))
githubLogin() {}

@Get('github/callback')
@UseGuards(AuthGuard('github'))
async githubCallback(@Req() req, @Res() res) {
  const result = await this.authService.loginGithubUser(req.user);
  const token = result.access_token;
  res.redirect(`http://localhost:4200/auth/callback?token=${token}`);
}
}
