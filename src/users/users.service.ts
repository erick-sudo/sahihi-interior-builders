import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { CreateUserDto } from './user.dtos';
import { PasswordService } from 'src/password/password.service';
import { GrantedAuthority } from 'src/auth/authentication/authentication.guard';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmailOrPhoneNumber(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    return user;
  }
  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async briefUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });
    return users;
  }

  async findById(id: string) {
    return await this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      kraPin,
      kraAttachment,
      password,
    } = createUserDto;
    const userInput: Prisma.UserCreateInput = {
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      kraPin,
      kraAttachment,
      passwordDigest: PasswordService.hashedPassword(password),
    };
    const createUser = await this.prisma.user.create({
      data: userInput,
    });
    return createUser;
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const updateUser = await this.prisma.user.update({
      where: params.where,
      data: params.data,
    });
    return updateUser;
  }

  async deleteUser(id: string) {
    await this.prisma.user.delete({
      where: { id },
    });
    return null;
  }

  async ensureExists(userIds: string[]) {
    for (let userId of userIds) {
      try {
        this.ensureExistsById(userId);
      } catch (e) {
        throw new NotFoundException('Some user does not exist.');
      }
    }
  }

  async ensureExistsById(userId: string) {
    return await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
  }

  async getAuthorities(user: User): Promise<GrantedAuthority[]> {
    return await this.prisma.role.findMany({
      where: {
        projectAssignments: {
          some: {
            userId: user.id,
          },
        },
      },
    });
  }
}
