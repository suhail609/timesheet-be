import { UserRole } from 'src/user/enums/user-role.enum';

export type AuthenticatedUser = {
  id: string;
  email: string;
  firstName: string;
  role: UserRole;
};
