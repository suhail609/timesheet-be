import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { AuthenticatedUser } from '../types/authenticated-user.type';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<AuthenticatedUser> {
    if (password === '')
      throw new UnauthorizedException('Please Provide The Password');

    const user = await this.authService.validateUser(email, password);
    return {
      id: user.id!,
      firstName: user.firstName,
      email: user.email,
      role: user.role,
    };
  }
}
