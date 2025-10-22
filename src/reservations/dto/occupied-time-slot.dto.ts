import { ApiProperty } from '@nestjs/swagger';

export class OccupiedTimeSlotDto {
  @ApiProperty({
    description: 'Время начала занятого слота',
    example: '18:00',
  })
  start: string;

  @ApiProperty({
    description: 'Время окончания занятого слота',
    example: '20:00',
  })
  end: string;

  @ApiProperty({
    description: 'ID бронирования, занимающего этот слот',
    example: 'b42bb960-ff62-4ca6-8e9d-c47ce9470ed6',
  })
  reservation_id: string;
}