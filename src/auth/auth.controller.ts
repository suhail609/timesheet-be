import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignupDto } from './dto/user-signup.dto';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RequestWithUser } from './interface/request-with-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() userSignupDto: UserSignupDto) {
    return await this.authService.signup(userSignupDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Req() req: RequestWithUser) {
    const authData = await this.authService.signin(req.user);
    return authData;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: RequestWithUser) {
    const profile = await this.authService.getProfile(req.user);
    return profile;
  }
}
