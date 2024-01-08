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
import { User } from '../user/entities/user.entity';
import { Project } from '../projects/entities/projects.entity';

// DTOs
import { CreateProjectUserDto } from './dto/create-project-user.dto';

@Injectable()
export class ProjectUsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
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
    const response =
      await this.projectUserRepository.save(createProjectUserDto);
    response.project = project;
    response.user = user;
    response.project.referringEmployee = referringEmployee;
    delete response.user.password;
    delete response.project.referringEmployee.password;
    return response;
  }

  async findAll(userId: string) {
    const projectsUser = await this.projectUserRepository.find({
      where: { userId: userId },
      relations: ['project', 'user'],
    });
    const requester = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (requester.role === 'Employee') {
      projectsUser.map((projectUser) => {
        delete projectUser.project;
        delete projectUser.user;
      });
    }
    if (!projectsUser) {
      return '';
    }
    return projectsUser;
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
