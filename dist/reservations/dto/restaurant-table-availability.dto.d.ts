import { ReservationResponseDto } from './reservation-response.dto';
import { OccupiedTimeSlotDto } from './occupied-time-slot.dto';
export declare class RestaurantTableAvailabilityDto {
    reservations: ReservationResponseDto[];
    occupiedTimeSlots: OccupiedTimeSlotDto[];
}
