import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../user/entities/user.entity';
import { Projects } from './entities/projects.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectUser } from '../project-users/entities/project-user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    @InjectRepository(Projects)
    private readonly projectRepository: Repository<Projects>,
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
    delete manager.password;
    return {
      id: response.id,
      name: response.name,
      referringEmployeeId: response.referringEmployeeId,
      referringEmployee: manager,
    };
  }

  async findAll(userId: string) {
    const requester = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (requester.role !== 'Employee') {
      const response = await this.projectUserRepository.find();
      return await this.formatDataUser(response);
    }
    const response = await this.projectUserRepository.find({
      where: { userId: userId },
    });
    return await this.formatDataUser(response);
  }

  async formatDataUser(data: ProjectUser[]) {
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
