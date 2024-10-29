import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  welcome() {
    return {
      title: 'SAHIHI-INTERIORS-BUILDERS',
    };
  }

  env() {
    return {
      DATABASE_NAME: this.configService.get<string>('DATABASE_URL'),
    };
  }
}
