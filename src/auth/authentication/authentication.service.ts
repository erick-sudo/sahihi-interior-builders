import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from 'src/users/user.dtos';
import { AuthenticatedUser } from 'src/users/user.authenticated';

@Injectable()
export class AuthenticationService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn({ email, password }: SignInDto) {
    const user = await this.usersService.findByEmailOrPhoneNumber({ email });
    const authenticatedUser = new AuthenticatedUser(user);
    if (!authenticatedUser.verifyPassword(password)) {
      throw new UnauthorizedException('Wrong password');
    }

    const payload = { sub: user.id, email: user.email };

    return { access_token: await this.jwtService.signAsync(payload, {}) };
  }
}
