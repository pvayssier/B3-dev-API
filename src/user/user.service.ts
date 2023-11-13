import { isEmail, isUUID } from 'class-validator';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// DOTs
import { createUserDTO } from './dto/createUserDTO';

// Entities
import { Users } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: createUserDTO) {
    if (createUserDto.username === undefined) {
      throw new BadRequestException('username should not be empty');
    }
    if (!isEmail(createUserDto.email)) {
      throw new BadRequestException('email must be an email');
    }
    if (
      createUserDto.password.length < 8 ||
      createUserDto.username.length < 3
    ) {
      throw new BadRequestException();
    }
    const isUsernameDuplicate = await this.isUsernameDuplicate(
      createUserDto.username,
    );
    const isEmailDuplicate = await this.isEmailDuplicate(createUserDto.email);
    if (isUsernameDuplicate || isEmailDuplicate) {
      throw new InternalServerErrorException();
    }

    const response = await this.userRepository.save(createUserDto);
    return {
      username: response.username,
      email: response.email,
      id: String(response.id),
      role: response.role,
    };
  }

  async isUsernameDuplicate(username: string) {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });
    return user != null;
  }

  async isEmailDuplicate(email: string) {
    const user = await this.userRepository.findOne({ where: { email: email } });
    return user != null;
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (user === null || user.password === undefined) {
      throw new UnauthorizedException();
    }
    if (bcrypt.compareSync(password, user.password) === false) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async findAll() {
    const responseDB = await this.userRepository.find();
    const response = responseDB.map((user) => {
      return {
        username: user.username,
        email: user.email,
        id: String(user.id),
        role: user.role,
      };
    });
    return response;
  }

  async findOne(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    const response = await this.userRepository.findOne({
      where: { id: id },
    });
    if (response === null) {
      throw new NotFoundException();
    }
    return {
      username: response.username,
      email: response.email,
      id: String(response.id),
      role: response.role,
    };
  }
}
