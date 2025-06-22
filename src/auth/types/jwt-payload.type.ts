import { UserRole } from 'src/user/enums/user-role.enum';

export type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
};
