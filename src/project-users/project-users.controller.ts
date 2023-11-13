import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// Local Services & Entities
import { ProjectUsersService } from './project-users.service';
import { CreateProjectUserDto } from './dto/create-project-user.dto';
import { AuthGuard } from '../guard';

@Controller('project-users')
@ApiTags('project-users')
export class ProjectUsersController {
  constructor(private readonly projectUsersService: ProjectUsersService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(
    @Request() req,
    @Body() createProjectUserDto: CreateProjectUserDto,
  ) {
    const response = await this.projectUsersService.create(
      req.user.sub,
      createProjectUserDto,
    );
    return response;
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(@Request() req) {
    return await this.projectUsersService.findAll(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.projectUsersService.findOne(id);
  }
}
