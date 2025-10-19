import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { UserRole } from '../entities/user-role.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { UpdateProfileDto } from '../users/dto/update-profile.dto';
import { ChangePasswordDto } from '../users/dto/change-password.dto';
export declare class AuthService {
    private userRepository;
    private userRoleRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, userRoleRepository: Repository<UserRole>, jwtService: JwtService);
    validateUser(username: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    getProfile(userId: string): Promise<any>;
    register(registerDto: RegisterDto): Promise<RegisterResponseDto>;
    getUserDatabaseRole(role: string): Promise<string>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<any>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<any>;
}
