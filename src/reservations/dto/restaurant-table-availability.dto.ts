import { ApiProperty } from '@nestjs/swagger';
import { ReservationResponseDto } from './reservation-response.dto';
import { OccupiedTimeSlotDto } from './occupied-time-slot.dto';

export class RestaurantTableAvailabilityDto {
  @ApiProperty({
    description: 'Список активных бронирований для данного столика на выбранную дату',
    type: [ReservationResponseDto],
  })
  reservations: ReservationResponseDto[];

  @ApiProperty({
    description: 'Список занятых временных слотов',
    type: [OccupiedTimeSlotDto],
  })
  occupiedTimeSlots: OccupiedTimeSlotDto[];
}