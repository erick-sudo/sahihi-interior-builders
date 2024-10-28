import { User } from '@prisma/client';
import * as bcrypt from "bcrypt"

export class AuthenticatedUser {
  constructor(private user: User) {}

  verifyPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.user.passwordDigest);
  }
}
