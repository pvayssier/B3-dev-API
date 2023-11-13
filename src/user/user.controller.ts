import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// Services & Entities
import { UserService } from './user.service';
import { AuthGuard } from '../guard';

// DTOs
import { createUserDTO } from './dto/createUserDTO';
import { loginUserDTO } from './dto/loginUserDTO';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('auth/sign-up')
  async create(@Body() createUser: createUserDTO) {
    createUser.password = await bcrypt.hash(createUser.password, 10);
    return await this.userService.create(createUser);
  }

  @Post('auth/login')
  async login(@Body() user: loginUserDTO) {
    return await this.userService.login(user.email, user.password);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('me')
  async me(@Request() req) {
    return await this.userService.findOne(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll() {
    const response = await this.userService.findAll();
    return response;
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }
}
