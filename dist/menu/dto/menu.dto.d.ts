export declare class MenuItemResponseDto {
    item_id: number;
    item_name: string;
    item_description?: string;
    category_id: number;
    price: number;
    cooking_time_minutes: number;
    calories?: number;
    is_vegetarian: boolean;
    is_spicy: boolean;
    is_deleted: boolean;
    image_url?: string;
    created_at: Date;
    updated_at: Date;
    category?: {
        category_id: number;
        category_name: string;
        category_description?: string;
    };
}
export declare enum MenuSortField {
    PRICE = "price",
    COOKING_TIME = "cooking_time_minutes",
    CALORIES = "calories",
    NAME = "item_name",
    CREATED_AT = "created_at"
}
export declare enum SortOrder {
    ASC = "ASC",
    DESC = "DESC"
}
export declare class MenuFilterDto {
    search?: string;
    category_id?: number;
    is_vegetarian?: boolean;
    is_spicy?: boolean;
    min_price?: number;
    max_price?: number;
    max_cooking_time?: number;
    max_calories?: number;
    sort_by?: MenuSortField;
    sort_order?: SortOrder;
    page?: number;
    limit?: number;
}
export declare class CreateMenuItemDto {
    item_name: string;
    item_description?: string;
    category_id: number;
    price: number;
    cooking_time_minutes?: number;
    calories?: number;
    is_vegetarian?: boolean;
    is_spicy?: boolean;
    image_url?: string;
}
export declare class UpdateMenuItemDto {
    item_name?: string;
    item_description?: string;
    category_id?: number;
    price?: number;
    cooking_time_minutes?: number;
    calories?: number;
    is_vegetarian?: boolean;
    is_spicy?: boolean;
    image_url?: string;
}
export declare class MenuPaginationResponseDto {
    items: MenuItemResponseDto[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}
