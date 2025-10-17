export declare class User {
    user_id: string;
    username: string;
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    phone: string;
    role_id: number;
    created_at: Date;
    updated_at: Date;
    last_login: Date;
    role: any;
    addresses: any[];
    orders: any[];
    reservations: any[];
    reviews: any[];
}
