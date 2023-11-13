import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// Services & Entities
import { ProjectsService } from './projects.service';
import { AuthGuard } from '../guard';

// DTOs
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('projects')
@ApiTags('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    const response = await this.projectsService.create(
      req.user.sub,
      createProjectDto,
    );
    return response;
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(@Request() req) {
    return await this.projectsService.findAll(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return await this.projectsService.findOne(req.user.sub, id);
  }
}
