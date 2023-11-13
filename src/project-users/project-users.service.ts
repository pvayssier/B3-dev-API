import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';

// Entities
import { ProjectUser } from './entities/project-user.entity';
import { Users } from '../user/entities/user.entity';
import { Projects } from '../projects/entities/projects.entity';

// DTOs
import { CreateProjectUserDto } from './dto/create-project-user.dto';

@Injectable()
export class ProjectUsersService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    @InjectRepository(Projects)
    private readonly projectRepository: Repository<Projects>,
    @InjectRepository(ProjectUser)
    private readonly projectUserRepository: Repository<ProjectUser>,
  ) {}

  async create(userId: string, createProjectUserDto: CreateProjectUserDto) {
    const requester = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (requester.role === 'Employee') {
      throw new UnauthorizedException();
    }
    const project = await this.projectRepository.findOne({
      where: { id: createProjectUserDto.projectId },
    });
    const user = await this.userRepository.findOne({
      where: { id: createProjectUserDto.userId },
    });
    if (!project || !user) {
      throw new NotFoundException();
    }

    const existingProjects = await this.projectUserRepository.find({
      where: { userId: createProjectUserDto.userId },
    });

    const formatedStartDate = dayjs(createProjectUserDto.startDate);
    const formatedEndDate = dayjs(createProjectUserDto.endDate);

    for (const project of existingProjects) {
      const existingProjectStart = dayjs(project.startDate);
      const existingProjectEnd = dayjs(project.endDate);

      if (
        (formatedStartDate.isAfter(existingProjectStart) &&
          formatedStartDate.isBefore(existingProjectEnd)) ||
        (formatedEndDate.isAfter(existingProjectStart) &&
          formatedEndDate.isBefore(existingProjectEnd)) ||
        (formatedStartDate.isBefore(existingProjectStart) &&
          formatedEndDate.isAfter(existingProjectEnd))
      ) {
        throw new ConflictException();
      }
    }

    const referringEmployee = await this.userRepository.findOne({
      where: { id: project.referringEmployeeId },
    });
    const projectUser =
      await this.projectUserRepository.save(createProjectUserDto);
    const response = {
      id: projectUser.id,
      startDate: projectUser.startDate,
      endDate: projectUser.endDate,
      userId: projectUser.userId,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      projectId: createProjectUserDto.projectId,
      project: {
        id: project.id,
        name: project.name,
        referringEmployeeId: project.referringEmployeeId,
        referringEmployee: {
          id: referringEmployee.id,
          username: referringEmployee.username,
          email: referringEmployee.email,
          role: referringEmployee.role,
        },
      },
    };
    return response;
  }

  async findAll(userId: string) {
    const projectsUser = this.projectUserRepository.find({
      where: { userId: userId },
    });
    if (!projectsUser) {
      return '';
    }
    const requester = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (requester.role === 'Employee') {
      const response = [];
      for (const projectUser of await projectsUser) {
        const project = await this.projectRepository.findOne({
          where: { id: projectUser.projectId },
        });
        const projectUserResponse = {
          id: projectUser.id,
          name: project.name,
          referringEmployeeId: project.referringEmployeeId,
        };
        response.push(projectUserResponse);
      }
      return response;
    }
    return await projectsUser;
  }

  async findOne(id: string) {
    const projectsUser = await this.projectUserRepository.findOne({
      where: { id: id },
    });
    if (!projectsUser) {
      throw new NotFoundException();
    }
    return projectsUser;
  }
}
