import { Module } from '@nestjs/common';
import { ProjectUsersService } from './project-users.service';
import { ProjectUsersController } from './project-users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../user/entities/user.entity';
import { Projects } from '../projects/entities/projects.entity';
import { ProjectUser } from './entities/project-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Projects, ProjectUser])],
  controllers: [ProjectUsersController],
  providers: [ProjectUsersService],
})
export class ProjectUsersModule {}
