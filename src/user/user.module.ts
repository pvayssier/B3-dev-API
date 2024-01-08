import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { jwtConstants } from '../constants';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Event } from '../Event/entities/event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Event]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
