import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  BadRequestException,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PreAuthorize } from 'src/auth/authorization/authorization.decorators';
import { UserRole } from 'src/auth/authentication/authentication.guard';

@Controller('roles')
@PreAuthorize<UserRole>({
  tokens: [{ name: 'ROLE_ADMIN' }],
})
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () =>
          new BadRequestException('Invalid id format for role ID'),
      }),
    )
    id: string,
  ) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () =>
          new BadRequestException('Invalid id format for role ID'),
      }),
    )
    id: string,
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  remove(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () =>
          new BadRequestException('Invalid id format for role ID'),
      }),
    )
    id: string,
  ) {
    return this.rolesService.remove(id);
  }

  
}
