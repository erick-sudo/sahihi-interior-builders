import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() createUserInput: Prisma.UserCreateInput) {
    return this.userService.createUser(createUserInput);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUser: Prisma.UserUpdateInput,
  ) {
    return this.userService.updateUser({
      where: { id },
      data: updateUser,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.deleteUser({
      id,
    });
  }
}
