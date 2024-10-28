import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthenticatedUser } from './users/user.authenticated';
import { PasswordService } from './password/password.service';
import { Public } from './decorators/route.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('env')
  env() {
    return this.appService.env();
  }

  @Get('usr')
  @Public()
  usr() {
    return new AuthenticatedUser({
      id: 'a85d23dc-cb6a-4a5f-bbd4-a2f93772d382',
      firstName: 'Erick',
      lastName: 'Obuya',
      email: 'erickochieng766@gmail.com',
      phoneNumber: '',
      kraPin: '3424534',
      passwordDigest: PasswordService.hashedPassword('Password123'),
      address: 'Mirema',
      kraAttachment: 'kraAttachment',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
