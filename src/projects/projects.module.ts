import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from 'src/users/users.service';
import { RolesService } from 'src/roles/roles.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, UsersService, RolesService],
})
export class ProjectsModule {}
