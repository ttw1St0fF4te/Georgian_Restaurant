import { OrderType } from '../../entities/order.entity';
export declare class OrderResponseDto {
    order_id: string;
    user_id: string;
    order_type: OrderType;
    delivery_country?: string;
    delivery_city?: string;
    delivery_street_address?: string;
    delivery_phone?: string;
    reservation_id?: string;
    subtotal: number;
    delivery_fee: number;
    total_amount: number;
    created_at: Date;
    updated_at: Date;
    order_items?: OrderItemResponseDto[];
}
export declare class OrderItemResponseDto {
    order_item_id: number;
    item_id: number;
    item_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
}
