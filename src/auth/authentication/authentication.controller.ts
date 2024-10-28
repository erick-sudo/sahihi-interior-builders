import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  Res,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Request as ExpressRequest, Response } from 'express';
import { Public } from 'src/decorators/route.decorator';
import { SignInDto } from 'src/users/user.dtos';
import { AuthenticationService } from './authentication.service';
import { ConfigService } from '@nestjs/config';

export const SESSION_KEY = 'session';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signin')
  @Public()
  async signIn(
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const sign = await this.authenticationService.signIn(signInDto);

    response.cookie(SESSION_KEY, sign.access_token, {
      httpOnly: true,
      // Cookie to be sent over https in production environment
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      // Cookie expires after an hour
      maxAge: 60 * 60 * 1000,
      // Prevent CSRF
      sameSite: 'lax',
    });

    return {
      message: 'Signin successful.',
    };
  }

  @Get('current/user')
  currentUser(@Request() req: ExpressRequest) {
    return {
      principal: req.authentication?.principal,
      authorities: req.authentication?.authorities,
    };
  }

  @Get('signout')
  signout(@Res({ passthrough: true }) response: Response) {
    // Clear the 'session' cookie
    response.clearCookie(SESSION_KEY, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
    });

    return {
      message: 'Logout successful',
    };
  }
}
