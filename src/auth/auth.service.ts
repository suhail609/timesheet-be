import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords, hashPassword } from 'src/common/utils/hashing.util';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { UserAuthDto } from './dto/user-auth.dto';
import { AuthenticatedUser } from './types/authenticated-user.type';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOne({ email });

    if (!user) throw new UnauthorizedException('User not found');

    const isPasswordMatch = await comparePasswords(password, user.password);

    if (!isPasswordMatch)
      throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async signup(userAuthDto: UserAuthDto) {
    const existingUser = await this.userService.findOne({
      email: userAuthDto.email,
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    userAuthDto.password = await hashPassword(userAuthDto.password);

    const newUser = { ...userAuthDto };
    const user = await this.userService.create(newUser);
    const payload: JwtPayload = {
      sub: user.id!,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    // const userDto = new CreateUserDto(user);
    const response = {
      accessToken,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    };
    return response;
  }

  async signin(user: AuthenticatedUser) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const jwtToken = await this.jwtService.signAsync(payload);
    // const userDto = new CreateUserDto(user);
    return {
      accessToken: jwtToken,
      user: {
        firstName: user.firstName,
        email: user.email,
        role: user.role,
      },
    };
  }
}
