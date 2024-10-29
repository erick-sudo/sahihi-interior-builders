import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { RolesService } from 'src/roles/roles.service';
import { AssignProjectRolessDto } from './dto/assign-project-roles.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

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

  async assignRoles(projectId: string, assignment: AssignProjectRolessDto) {
    // Ensure project exists
    await this.ensureExistsById(projectId);

    // Check if this particular role exists
    const role = await this.rolesService.findRoleById(assignment.role);

    // Ensure each user exists before assignment
    await this.userService.ensureExists(assignment.users);

    // Persist project assignments to the database
    const project = await this.prisma.projectAssignment.createMany({
      data: assignment.users.map((userId) => ({
        userId: userId,
        projectId: projectId,
        roleId: role.id,
      })),
    });

    return {
      message: `Project role${assignment.users.length > 1 ? 's' : ''} successfully assigned.`,
    };
  }

  async unassignRoles(projectId: string, assignment: AssignProjectRolessDto) {
    // Ensure project exists
    await this.ensureExistsById(projectId);

    // Check if this particular role exists
    const role = await this.rolesService.findRoleById(assignment.role);

    // Fetch this projects' project managers
    const assignments = await this.prisma.projectAssignment.deleteMany({
      where: {
        userId: {
          in: assignment.users,
        },
        projectId: projectId,
        roleId: role.id,
      },
    });

    return {
      message: `Project roles${assignment.users.length > 0 ? 's' : ''} successfully unassigned.`,
    };
  }

  async projectAssignments(projectId: string) {
    // Ensure project exists
    await this.ensureExistsById(projectId);

    // // Check if this particular role exists
    // const role = await this.rolesService.findRoleByName(roleName);

    const usersWithAssignments = await this.prisma.user.findMany({
      where: {
        projectAssignments: {
          some: {
            projectId: projectId
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        projectAssignments: {
          select: {
            id: true,
            assignedAt: true,
            role: {
              select: { id: true, name: true },
            },
            project: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    // Flattening the data in JavaScript
    const flatRecords = usersWithAssignments.flatMap((user) =>
      user.projectAssignments.map((assignment) => ({
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        assignmentId: assignment.id,
        assignedAt: assignment.assignedAt,
        roleId: assignment.role.id,
        roleName: assignment.role.name,
        projectId: assignment.project.id,
        projectName: assignment.project.name,
      })),
    );

    return flatRecords;
  }

  async ensureExists(projectIds: string[]) {
    for (let projectId of projectIds) {
      try {
        this.ensureExistsById(projectId);
      } catch (e) {
        throw new NotFoundException('Some user does not exist.');
      }
    }
  }

  async ensureExistsById(projectId: string) {
    return await this.prisma.project.findUniqueOrThrow({
      where: { id: projectId },
    });
  }
}
