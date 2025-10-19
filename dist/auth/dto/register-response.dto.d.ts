export declare class RegisterResponseDto {
    status: string;
    message: string;
    user: {
        user_id: string;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        role: string;
        role_id: number;
    };
    created_at: string;
}
