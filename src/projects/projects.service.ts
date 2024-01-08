import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Project } from './entities/projects.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectUser } from '../project-users/entities/project-user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectUser)
    private readonly projectUserRepository: Repository<ProjectUser>,
  ) {}

  async create(userId: string, createProjectDto: CreateProjectDto) {
    const requester = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (requester.role !== 'Admin') {
      throw new UnauthorizedException();
    }
    const { referringEmployeeId } = createProjectDto;
    const manager = await this.userRepository.findOne({
      where: { id: referringEmployeeId },
    });
    if (manager.role === 'Employee') {
      throw new UnauthorizedException();
    }
    const response = await this.projectRepository.save(createProjectDto);
    response.referringEmployee = manager;
    delete response.referringEmployee.password;
    delete response.referringEmployee.projectUsers;
    return {
      id: response.id,
      name: response.name,
      referringEmployeeId: response.referringEmployeeId,
      referringEmployee: response.referringEmployee,
    };
  }

  async findAll(userId: string) {
    const requester = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (requester.role !== 'Employee') {
      const response = await this.projectRepository.find();
      return await this.formatDataProjects(response);
    }
    const response = await this.projectUserRepository.find({
      where: { userId: userId },
    });
    const data = this.formatDataProjectUser(response);
    return data;
  }

  async formatDataProjectUser(data: ProjectUser[]) {
    const response = [];
    for (const projectUser of data) {
      const project = await this.projectRepository.findOne({
        where: { id: projectUser.projectId },
      });
      const manager = await this.userRepository.findOne({
        where: { id: project.referringEmployeeId },
      });
      delete manager.password;
      response.push({
        id: project.id,
        name: project.name,
        referringEmployeeId: project.referringEmployeeId,
        referringEmployee: manager,
      });
    }
    return response;
  }

  async formatDataProjects(data: Project[]) {
    const response = [];
    for (const project of data) {
      const manager = await this.userRepository.findOne({
        where: { id: project.referringEmployeeId },
      });
      delete manager.password;
      response.push({
        id: project.id,
        name: project.name,
        referringEmployeeId: project.referringEmployeeId,
        referringEmployee: manager,
      });
    }
    return response;
  }

  async findOne(userId: string, projectId: string) {
    const requester = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (requester.role === 'Employee') {
      const response = await this.projectUserRepository.findOne({
        where: { userId: userId, projectId: projectId },
      });
      if (!response) {
        throw new ForbiddenException();
      }
    }
    const response = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (response) {
      return response;
    }
    throw new NotFoundException();
  }
}
