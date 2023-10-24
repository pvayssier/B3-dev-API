import { ApiProperty } from '@nestjs/swagger';

export class createUserDTO {
  @ApiProperty({ minLength: 8 })
  username: string;

  @ApiProperty({ minLength: 8, format: 'email' })
  email: string;

  @ApiProperty({ minLength: 8 })
  password: string;

  @ApiProperty({ enum: ['Employee', 'Admin', 'ProjectManager'] })
  role: 'Employee' | 'Admin' | 'ProjectManager' = 'Employee';
}
