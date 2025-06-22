import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/user/enums/user-role.enum';

export const USER_ROLES_KEY = 'USER_ROLES';
export const UserRoles = (...roles: [UserRole, ...UserRole[]]) =>
  SetMetadata(USER_ROLES_KEY, roles);
