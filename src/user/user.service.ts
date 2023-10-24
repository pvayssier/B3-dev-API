import { isEmail } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// DOTs
import { UpdateUserDto } from './dto/update-user.dto';
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
      return {
        code: 400,
        obj: 'username should not be empty',
      };
    }
    if (!isEmail(createUserDto.email)) {
      return {
        code: 400,
        obj: 'email must be an email',
      };
    }
    if (
      createUserDto.password.length < 8 ||
      createUserDto.username.length < 3
    ) {
      return {
        code: 400,
        obj: {},
      };
    }
    const isUsernameDuplicate = await this.isUsernameDuplicate(
      createUserDto.username,
    );
    const isEmailDuplicate = await this.isEmailDuplicate(createUserDto.email);
    if (isUsernameDuplicate || isEmailDuplicate) {
      return {
        code: 500,
        obj: {},
      };
    }

    const response = await this.userRepository.save(createUserDto);
    return {
      code: 201,
      obj: {
        username: response.username,
        email: response.email,
        id: String(response.id),
        role: response.role,
      },
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
      return {
        code: 401,
        obj: {},
      };
    }
    if (bcrypt.compareSync(password, user.password) === false) {
      return {
        code: 401,
        obj: 'guentanamo',
      };
    }
    const payload = { sub: user.id, username: user.username };
    return {
      code: 201,
      obj: { access_token: await this.jwtService.signAsync(payload) },
    };
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const response = await this.userRepository.findOne({ where: { id: id } });
    if (response === undefined) {
      return {
        code: 401,
        obj: '',
      };
    }
    return {
      code: 200,
      obj: {
        username: response.username,
        email: response.email,
        id: String(response.id),
        role: response.role,
      },
    };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return this.userRepository.delete({ id: id });
  }
}
