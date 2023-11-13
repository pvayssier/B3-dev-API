import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ minLength: 3 })
  name: string;

  @ApiProperty()
  referringEmployeeId: string;
}
