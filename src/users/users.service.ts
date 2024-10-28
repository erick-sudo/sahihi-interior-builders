import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

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

  async findById(id: string) {
    return await this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const createUser = await this.prisma.user.create({
      data,
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

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    const deleteUser = await this.prisma.user.delete({
      where,
    });
    return deleteUser;
  }
}
