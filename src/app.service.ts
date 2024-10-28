import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    return 'Hello World!';
  }

  env() {
    return {
      DATABASE_NAME: this.configService.get<string>('DATABASE_URL'),
    };
  }
}