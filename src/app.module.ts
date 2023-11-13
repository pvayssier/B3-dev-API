import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { Users } from './user/entities/user.entity';
import { Projects } from './projects/entities/projects.entity';
import { ProjectsModule } from './projects/projects.module';
import { ProjectUsersModule } from './project-users/project-users.module';
import { ProjectUser } from './project-users/entities/project-user.entity';

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
        entities: [Users, Projects, ProjectUser],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ProjectsModule,
    ProjectUsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
