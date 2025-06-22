import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USER_ROLES_KEY } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/user/enums/user-role.enum';
import { Request } from 'express';
import { CurrentUser } from 'src/auth/types/current-user.type';

@Injectable()
export class UserRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      USER_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as CurrentUser;
    const hasRequiredRole = requiredRoles.some((role) => user.role === role);

    return hasRequiredRole;
  }
}
