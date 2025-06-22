import { UserRole } from 'src/user/enums/user-role.enum';

export type CurrentUser = {
  id: string;
  email: string;
  role: UserRole;
};
