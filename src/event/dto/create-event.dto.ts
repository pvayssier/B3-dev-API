import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ type: Date })
  date: Date;

  @ApiProperty({ type: String })
  eventDescription: string = '';

  @ApiProperty({ enum: ['RemoteWork', 'PaidPaidLeaveLive'] })
  eventType: 'RemoteWork' | 'PaidPaidLeaveLive';
}
