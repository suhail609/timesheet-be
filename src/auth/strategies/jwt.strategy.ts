import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from '../config/jwt.config';
import { JwtPayload } from '../types/jwt-payload.type';
import { CurrentUser } from '../types/current-user.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        jwtConfiguration.secret ??
        (() => {
          throw new Error('JWT secret key is not defined');
        })(),
    });
  }

  validate(payload: JwtPayload) {
    //NOTE: retuned object will be appended to the request object under the name user
    //TODO: can create a validate if the user exists from data base and check the role, creating a new service in auth service
    // so that if the role is changed it can make but this will create a hit to db on all request

    const currentUser: CurrentUser = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    return currentUser;
  }
}
