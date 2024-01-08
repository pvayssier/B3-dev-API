import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Delete,
  Param,
} from '@nestjs/common';
import { EventService } from './event.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guard';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('events')
@ApiTags('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() createEventDto: CreateEventDto) {
    return this.eventService.create(req.user.sub, createEventDto);
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post(':id/validate')
  validate(@Request() req, @Param('id') id: string) {
    return this.eventService.validate(req.user.sub, id);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post(':id/decline')
  decline(@Request() req, @Param('id') id: string) {
    return this.eventService.decline(req.user.sub, id);
  }

  @Delete()
  async delete(userId: string) {
    return await this.eventService.remove(userId);
  }
}
