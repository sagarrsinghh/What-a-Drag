import {Injectable,CanActivate,ExecutionContext,ForbiddenException,UnauthorizedException,} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/common/enums/role.enum';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }
    if (!user.role) {
      throw new ForbiddenException('User role not found');
    }
    const userRole = String(user.role).trim().toLowerCase();
    const hasRole =
      userRole === Role.SUPER_ADMIN ||
      userRole === 'super_admin' ||
      requiredRoles.some((r) => String(r).trim().toLowerCase() === userRole);

    if (!hasRole) {
      throw new ForbiddenException('Access denied');
    }
    return true;
  }
}
