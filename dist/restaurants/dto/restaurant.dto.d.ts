export declare class RestaurantResponseDto {
    restaurant_id: number;
    restaurant_name: string;
    restaurant_description?: string;
    country: string;
    city: string;
    street_address: string;
    working_hours?: Record<string, string>;
    is_active: boolean;
    rating: number;
    created_at: Date;
    updated_at: Date;
}
export declare class RestaurantDetailResponseDto extends RestaurantResponseDto {
    stats?: {
        total_tables: number;
        total_capacity: number;
        total_reviews: number;
        average_rating: number;
    };
}
export declare class CreateRestaurantDto {
    restaurant_name: string;
    restaurant_description?: string;
    country?: string;
    city?: string;
    street_address: string;
    working_hours?: Record<string, string>;
    is_active?: boolean;
}
export declare class UpdateRestaurantDto {
    restaurant_name?: string;
    restaurant_description?: string;
    country?: string;
    city?: string;
    street_address?: string;
    working_hours?: Record<string, string>;
    is_active?: boolean;
    rating?: number;
}
export declare class RestaurantFilterDto {
    search?: string;
    city?: string;
    country?: string;
    is_active?: boolean;
    min_rating?: number;
}
