import { ApiProperty } from '@nestjs/swagger';

export class loginUserDTO {
  @ApiProperty({ format: 'email' })
  email: string;

  @ApiProperty({ minLength: 8 })
  password: string;
}
