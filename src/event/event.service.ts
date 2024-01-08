import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';

import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import * as weekOfYear from 'dayjs/plugin/weekOfYear';
import { User } from '../user/entities/user.entity';
import { ProjectUser } from '../project-users/entities/project-user.entity';
dayjs.extend(weekOfYear);

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ProjectUser)
    private readonly projectUserRepository: Repository<ProjectUser>,
  ) {}

  async create(userId: string, createEventDto: CreateEventDto) {
    const events = await this.getSameDay(userId, createEventDto);
    const threeTTInWeek = await this.threeTTInWeek(userId, createEventDto);
    if (events.length > 0 || threeTTInWeek) {
      throw new UnauthorizedException();
    }
    const event = new Event();
    event.userId = userId;
    event.date = createEventDto.date;
    event.eventType = createEventDto.eventType;
    event.eventDescription = createEventDto.eventDescription;
    return this.eventRepository.save(event);
  }

  async getSameDay(user: string, createEventDto: CreateEventDto) {
    const userEvents = await this.eventRepository.find({
      where: { date: createEventDto.date },
    });
    const events = [];
    for (const event of userEvents) {
      if (event.userId === user) {
        events.push(event);
      }
    }
    return events;
  }

  async threeTTInWeek(
    userId: string,
    createEventDto: CreateEventDto,
  ): Promise<boolean> {
    const startOfWeek = dayjs(createEventDto.date)
      .startOf('week')
      .subtract(1, 'day');
    const endOfWeek = startOfWeek.add(6, 'day');
    const events = await this.eventRepository.find({
      where: {
        userId: userId,
        eventType: 'RemoteWork',
        // eventStatus: 'Accepted',
        date: Between(startOfWeek.toDate(), endOfWeek.toDate()),
      },
    });
    return events.length >= 2;
  }

  async validate(userId: string, eventId: string) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (!(await this.isAuthorized(userId, event))) {
      throw new UnauthorizedException();
    }
    await this.eventRepository.update(
      { id: eventId },
      { eventStatus: 'Accepted' },
    );
    return true;
  }

  async decline(userId: string, eventId: string) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (!(await this.isAuthorized(userId, event))) {
      throw new UnauthorizedException();
    }
    await this.eventRepository.update(
      { id: eventId },
      { eventStatus: 'Declined' },
    );
    return true;
  }

  async isAuthorized(userId: string, event: Event): Promise<boolean> {
    const requester = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (requester.role === 'Employee') {
      return false;
    }
    if (requester.role === 'ProjectManager') {
      const isAuthorizedManager = await this.projectUserRepository.findOne({
        where: {
          startDate: LessThanOrEqual(event.date),
          endDate: MoreThanOrEqual(event.date),
          project: {
            referringEmployeeId: userId,
          },
        },
        relations: ['project'],
      });
      return isAuthorizedManager != null;
    }
    return true;
  }

  findAll() {
    return this.eventRepository.find();
  }

  findOne(eventId: string) {
    return this.eventRepository.findOne({
      where: { id: eventId },
    });
  }

  async remove(userIda: string) {
    const a = await this.eventRepository.find({
      where: { userId: userIda },
    });
    for (const event of a) {
      this.eventRepository.delete({ id: event.id });
    }
    return a.length;
  }
}
