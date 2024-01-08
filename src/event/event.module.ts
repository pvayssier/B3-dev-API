import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event } from './entities/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { ProjectUser } from '../project-users/entities/project-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, User, ProjectUser])],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
