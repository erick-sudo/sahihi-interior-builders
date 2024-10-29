import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './user.dtos';
import { PreAuthorize } from 'src/auth/authorization/authorization.decorators';
import { UserRole } from 'src/auth/authentication/authentication.guard';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@PreAuthorize<UserRole>({ tokens: [{ name: 'ROLE_ADMIN' }] })
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    createUserDto: CreateUserDto,
  ) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  async index() {
    return this.userService.findAll();
  }

  @Get("index/brief")
  async indexBrief() {
    return this.userService.briefUsers();
  }

  @Get(':id')
  async show(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () =>
          new BadRequestException('Invalid id format for user ID'),
      }),
    )
    id: string,
  ) {
    return this.userService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () =>
          new BadRequestException('Invalid id format for user ID'),
      }),
    )
    id: string,
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser({
      where: { id },
      data: updateUserDto,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () =>
          new BadRequestException('Invalid id format for user ID'),
      }),
    )
    id: string,
  ) {
    return this.userService.deleteUser(id);
  }
}
