import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { UserSignupDto } from './dto/user-signup.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RequestWithUser } from './interface/request-with-user.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

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
}
