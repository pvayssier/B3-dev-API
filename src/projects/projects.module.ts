import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/projects.entity';
import { User } from '../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../constants';
import { ProjectUser } from '../project-users/entities/project-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Project, ProjectUser]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
