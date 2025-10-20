import { MenuItem } from './menu-item.entity';
export declare class CartItem {
    cart_item_id: number;
    cart_id: string;
    item_id: number;
    quantity: number;
    added_at: Date;
    updated_at: Date;
    cart: any;
    menuItem: MenuItem;
}
