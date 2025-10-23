import { OrderType } from '../../entities/order.entity';
export declare class CreateOrderDto {
    order_type: OrderType;
    delivery_country?: string;
    delivery_city?: string;
    delivery_street_address?: string;
    delivery_phone?: string;
    reservation_id?: string;
    should_update_user_address?: boolean;
}
