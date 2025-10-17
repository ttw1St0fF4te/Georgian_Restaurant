export declare enum ReservationStatus {
    UNCONFIRMED = "unconfirmed",
    CONFIRMED = "confirmed",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class TableReservation {
    reservation_id: string;
    user_id: string;
    restaurant_id: number;
    table_id: number;
    reservation_date: Date;
    reservation_time: string;
    duration_hours: number;
    guests_count: number;
    reservation_status: ReservationStatus;
    contact_phone: string;
    created_at: Date;
    updated_at: Date;
    confirmed_at: Date;
    user: any;
    restaurant: any;
    table: any;
    orders: any[];
}
