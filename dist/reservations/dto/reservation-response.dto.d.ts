import { ReservationStatus } from '../../entities/table-reservation.entity';
export declare class ReservationResponseDto {
    reservation_id: string;
    user_id: string;
    restaurant_id: number;
    restaurant_name: string;
    table_id: number;
    table_number: number;
    seats_count: number;
    reservation_date: string;
    reservation_time: string;
    duration_hours: number;
    guests_count: number;
    reservation_status: ReservationStatus;
    contact_phone: string;
    created_at: Date;
    updated_at: Date;
    confirmed_at?: Date;
}
