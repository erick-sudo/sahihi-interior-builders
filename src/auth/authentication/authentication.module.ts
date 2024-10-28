import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
  providers: [
    AuthenticationService,
    UsersService,
    PrismaService,
    ConfigService,
  ],
})
export class AuthenticationModule {}
