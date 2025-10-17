export declare enum OrderType {
    DELIVERY = "delivery",
    DINE_IN = "dine_in"
}
export declare class Order {
    order_id: string;
    user_id: string;
    order_type: OrderType;
    delivery_address: string;
    delivery_phone: string;
    reservation_id: string;
    subtotal: number;
    delivery_fee: number;
    total_amount: number;
    created_at: Date;
    updated_at: Date;
    user: any;
    reservation: any;
    order_items: any[];
}
