import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { UpdateProfileDto } from '../users/dto/update-profile.dto';
import { ChangePasswordDto } from '../users/dto/change-password.dto';
import { TokenBlacklistService } from './token-blacklist.service';
export declare class AuthController {
    private authService;
    private tokenBlacklistService;
    constructor(authService: AuthService, tokenBlacklistService: TokenBlacklistService);
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    register(registerDto: RegisterDto): Promise<RegisterResponseDto>;
    getProfile(req: any): Promise<any>;
    updateProfile(req: any, dto: UpdateProfileDto): Promise<any>;
    changePassword(req: any, dto: ChangePasswordDto): Promise<any>;
    getAllUsers(req: any): Promise<{
        user_id: string;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        phone: string;
        role: any;
        created_at: Date;
    }[]>;
    logout(req: any): Promise<{
        message: string;
        timestamp: string;
    }>;
}
