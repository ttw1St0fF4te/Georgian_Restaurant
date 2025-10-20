export declare class JwtPayload {
    sub: string;
    username: string;
    email: string;
    role: string;
    role_id: number;
}
export declare class AuthResponseDto {
    access_token: string;
    user: {
        user_id: string;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        phone?: string;
        role: string;
        role_id: number;
        country?: string;
        city?: string;
        street_address?: string;
    };
}
