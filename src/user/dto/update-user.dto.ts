import { PartialType } from '@nestjs/swagger';
import { createUserDTO } from './createUserDTO';

export class UpdateUserDto extends PartialType(createUserDTO) {}
