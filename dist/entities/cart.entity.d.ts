import { User } from './user.entity';
export declare class Cart {
    cart_id: string;
    user_id: string;
    created_at: Date;
    updated_at: Date;
    user: User;
    items: any[];
}
