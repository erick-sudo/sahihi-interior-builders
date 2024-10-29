import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  static hashedPassword(token: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(token, salt);
  }
}