import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { TokenBlacklistService } from './token-blacklist.service';
export declare class AuthController {
    private authService;
    private tokenBlacklistService;
    constructor(authService: AuthService, tokenBlacklistService: TokenBlacklistService);
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    getProfile(req: any): Promise<any>;
    logout(req: any): Promise<{
        message: string;
        timestamp: string;
    }>;
}
