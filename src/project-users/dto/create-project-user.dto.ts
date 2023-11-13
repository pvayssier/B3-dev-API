import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProjectUserDto {
  @ApiProperty({ type: Date })
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ type: Date })
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({ type: String })
  projectId: string;

  @ApiProperty({ type: String })
  userId: string;
}
