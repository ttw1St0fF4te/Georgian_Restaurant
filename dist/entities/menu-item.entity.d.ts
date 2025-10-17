export declare class MenuItem {
    item_id: number;
    item_name: string;
    item_description: string;
    category_id: number;
    price: number;
    cooking_time_minutes: number;
    calories: number;
    is_vegetarian: boolean;
    is_spicy: boolean;
    is_deleted: boolean;
    image_url: string;
    created_at: Date;
    updated_at: Date;
    category: any;
    order_items: any[];
}
