export declare class CartItemResponseDto {
    cart_item_id: number;
    item_id: number;
    item_name: string;
    item_description: string;
    unit_price: number;
    quantity: number;
    total_price: number;
    added_at: Date;
    image_url: string | null;
    category_name: string;
    is_vegetarian: boolean;
    is_spicy: boolean;
}
export declare class CartResponseDto {
    cart_id: string;
    user_id: string;
    items: CartItemResponseDto[];
    total_items: number;
    total_amount: number;
    created_at: Date;
    updated_at: Date;
}
