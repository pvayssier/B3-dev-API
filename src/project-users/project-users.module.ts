import { Module } from '@nestjs/common';
import { ProjectUsersService } from './project-users.service';
import { ProjectUsersController } from './project-users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Project } from '../projects/entities/projects.entity';
import { ProjectUser } from './entities/project-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Project, ProjectUser])],
  controllers: [ProjectUsersController],
  providers: [ProjectUsersService],
})
export class ProjectUsersModule {}
