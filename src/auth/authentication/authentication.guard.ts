import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/decorators/route.decorator';
import { UsersService } from 'src/users/users.service';
import { SESSION_KEY } from './authentication.controller';
import { Expose } from 'class-transformer';

// Roles
export class GrantedAuthority {
  @Expose()
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  toString() {
    return this.name;
  }
}

// Current logged in user
export class Principal {
  @Expose()
  email: string;

  @Expose()
  id: string;
}

// Authentication context
export class Authentication {
  #authorities: Array<GrantedAuthority>;
  #principal: Principal;

  private constructor() {
    this.#authorities = [];
  }

  static build(): Authentication {
    return new Authentication();
  }

  addAuthorities(...authorities: Array<GrantedAuthority>): Authentication {
    this.#authorities = this.#authorities.concat(authorities);
    return this;
  }

  setPrincipal(principal: Principal): Authentication {
    this.#principal = principal;
    return this;
  }

  get authorities() {
    return this.#authorities;
  }

  get principal() {
    return this.#principal;
  }
}

// Slotting an authentication property
// to hold the authentication context data
declare global {
  namespace Express {
    interface Request {
      authentication?: Authentication;
    }
  }
}

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      // 💡 Skipping auth if the requested endpoint is marked as public
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    return this.validateRequest(request);
  }

  async validateRequest(request: Request) {
    const token = this.extractTokenFromHeaderOrCookie(request);

    if (!token) {
      throw new UnauthorizedException(
        'Authentication details not found, you are not signed in.',
      );
    }

    // Extract the payload from the jwt
    const payload = await this.jwtService
      .verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      })
      .catch((_err) => {
        throw new UnauthorizedException(
          'Invalid or expired authentication details',
        );
      });

    const email = payload.email;
    // Attempt to find user from the database
    const user = await this.usersService
      .findByEmailOrPhoneNumber({
        email,
      })
      .catch((_err) => {
        // Invalid authentication details
        throw new UnauthorizedException(
          'Sorry! User with the provided authentication details could not be verified',
        );
      });

    // Attaching authtentication context (user details) to the request object
    request.authentication = Authentication.build()
      .addAuthorities(
        new GrantedAuthority('admin'),
        new GrantedAuthority('admin'),
        new GrantedAuthority('admin'),
      )
      .setPrincipal({ email: user.email, id: user.id });

    return true;
  }

  // Extract the 'Bearer' token from http request headers
  private extractTokenFromHeaderOrCookie(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer'
      ? token
      : request.cookies[SESSION_KEY] || undefined;
  }
}
