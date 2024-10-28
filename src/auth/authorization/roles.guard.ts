import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import {
  AuthorizationOptions,
  PRE_AUTHORIZE_KEY,
} from './authorization.decorators';
import { GrantedAuthority } from '../authentication/authentication.guard';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const authorizationOptions: AuthorizationOptions<GrantedAuthority> =
      this.reflector.getAllAndOverride(PRE_AUTHORIZE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    // Skip handles that do not require authorization
    if (!authorizationOptions) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authentication = request.authentication;

    if (!authentication) {
      throw new UnauthorizedException({
        message: 'Unauthorized Access',
        error: 'Could not authenticate',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    // Check if there  is an intersection of the current logged in user's roles
    // and the required handler's roles
    if (
      authentication.authorities.some((grantedAuthority) =>
        authorizationOptions.tokens?.length
          ? authorizationOptions.tokens.some(
              (token) => token.name === grantedAuthority.name,
            )
          : true,
      )
    ) {
      return true;
    }

    // Denie access if there are insufficient privileges
    throw new ForbiddenException({
      message: 'Forbidden Access',
      error:
        authorizationOptions.violationOptions?.message ||
        'You lack sufficient privileges to perform this action',
      statusCode: HttpStatus.FORBIDDEN,
    });
  }
}
