import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { ApiBearerAuth } from '@nestjs/swagger';

// Services & Entities
import { UserService } from './user.service';
import { AuthGuard } from './user.guard';

// DTOs
import { UpdateUserDto } from './dto/update-user.dto';
import { createUserDTO } from './dto/createUserDTO';
import { loginUserDTO } from './dto/loginUserDTO';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('auth/sign-up')
  async create(@Body() createUser: createUserDTO, @Res() res: Response) {
    // Hash password
    createUser.password = await bcrypt.hash(createUser.password, 10);
    const response = await this.userService.create(createUser);
    return res.status(response.code).json(response.obj);
  }

  @Post('auth/login')
  async login(@Body() user: loginUserDTO, @Res() res: Response) {
    const response = await this.userService.login(user.email, user.password);

    return res.status(response.code).json(response.obj);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('me')
  async me(@Request() req, @Res() res: Response) {
    const response = await this.userService.findOne(req.user.sub);
    return res.status(response.code).json(response.obj);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
