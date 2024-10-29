import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseUUIDPipe,
  BadRequestException,
  ValidationPipe,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PreAuthorize } from 'src/auth/authorization/authorization.decorators';
import { UserRole } from 'src/auth/authentication/authentication.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { AssignProjectRolessDto } from './dto/assign-project-roles.dto';
import { Request } from 'express';

@Controller('projects')
@UseInterceptors(ClassSerializerInterceptor)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @PreAuthorize<UserRole>({ tokens: [{ name: 'ROLE_ADMIN' }] })
  create(
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    createProjectDto: CreateProjectDto,
  ) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @PreAuthorize<UserRole>({
    tokens: [
      { name: 'ROLE_ADMIN' },
      { name: 'ROLE_PROJECT_MANAGER' },
      { name: 'ROLE_ENGINEER' },
    ],
  })
  findAll(@Req() request: Request) {
    return this.projectsService.findAll(request.authentication?.authorities!!);
  }

  @Get(':id')
  @PreAuthorize<UserRole>({
    tokens: [
      { name: 'ROLE_ADMIN' },
      { name: 'ROLE_PROJECT_MANAGER' },
      { name: 'ROLE_ENGINEER' },
    ],
  })
  findOne(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () =>
          new BadRequestException('Invalid id format for project ID'),
      }),
    )
    id: string,
  ) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @PreAuthorize<UserRole>({
    tokens: [{ name: 'ROLE_ADMIN' }, { name: 'ROLE_PROJECT_MANAGER' }],
  })
  update(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () =>
          new BadRequestException('Invalid id format for project ID'),
      }),
    )
    id: string,
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @PreAuthorize<UserRole>({
    tokens: [{ name: 'ROLE_ADMIN' }],
  })
  remove(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () =>
          new BadRequestException('Invalid id format for project ID'),
      }),
    )
    id: string,
  ) {
    return this.projectsService.remove(id);
  }

  @Patch(':id/roles/assign')
  @PreAuthorize<UserRole>({
    tokens: [{ name: 'ROLE_ADMIN' }],
  })
  async assignRole(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () =>
          new BadRequestException('Invalid id format for project ID'),
      }),
    )
    id: string,
    @Body()
    assignment: AssignProjectRolessDto,
  ) {
    return await this.projectsService.assignRoles(id, assignment);
  }

  @Patch(':id/roles/unassign')
  @PreAuthorize<UserRole>({
    tokens: [{ name: 'ROLE_ADMIN' }],
  })
  async unassignRole(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () =>
          new BadRequestException('Invalid id format for project ID'),
      }),
    )
    id: string,
    @Body()
    assignment: AssignProjectRolessDto,
  ) {
    return await this.projectsService.unassignRoles(id, assignment);
  }

  @Get(':id/project_assignments')
  async projectManagers(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () =>
          new BadRequestException('Invalid id format for project ID'),
      }),
    )
    id: string,
  ) {
    return await this.projectsService.projectAssignments(id);
  }
}
