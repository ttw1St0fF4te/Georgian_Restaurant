export interface WorkingHours {
    [key: string]: string;
}
export declare class Restaurant {
    restaurant_id: number;
    restaurant_name: string;
    restaurant_description: string;
    country: string;
    city: string;
    street_address: string;
    working_hours: WorkingHours;
    is_active: boolean;
    rating: number;
    created_at: Date;
    updated_at: Date;
    tables: any[];
    reservations: any[];
    reviews: any[];
}
