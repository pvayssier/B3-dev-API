import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Project } from './projects/entities/projects.entity';
import { ProjectsModule } from './projects/projects.module';
import { ProjectUsersModule } from './project-users/project-users.module';
import { ProjectUser } from './project-users/entities/project-user.entity';
import { Event } from './event/entities/event.entity';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Project, ProjectUser, Event],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ProjectsModule,
    ProjectUsersModule,
    EventModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
