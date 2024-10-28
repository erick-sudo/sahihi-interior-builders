import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
    return await this.prisma.project.create({
      data: createProjectDto,
    });
  }

  async findAll() {
    return await this.prisma.project.findMany();
  }

  async findOne(id: string) {
    return this.prisma.project.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    return await this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.project.delete({
      where: { id },
    });
  }
}
