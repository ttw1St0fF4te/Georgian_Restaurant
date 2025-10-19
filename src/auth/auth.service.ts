import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { UserRole } from '../entities/user-role.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto, JwtPayload } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    console.log('🔍 Attempting to validate user:', username);
    
    const user = await this.userRepository.findOne({
      where: [
        { username },
        { email: username }, // Позволяем входить как по username, так и по email
      ],
      relations: ['role'],
    });

    console.log('👤 User found:', user ? 'YES' : 'NO');
    
    if (user) {
      console.log('📧 User email:', user.email);
      console.log('🔑 Password hash:', user.password_hash ? user.password_hash.substring(0, 10) + '...' : 'NO HASH');
      
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      console.log('🔐 Password match:', passwordMatch);
      
      if (passwordMatch) {
        const { password_hash, ...result } = user;
        console.log('✅ User validated successfully');
        return result;
      }
    }
    
    console.log('❌ User validation failed');
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    // Получаем роль пользователя
    const userRole = await this.userRoleRepository.findOne({
      where: { role_id: user.role_id },
    });

    if (!userRole) {
      throw new UnauthorizedException('Роль пользователя не найдена');
    }

    // Обновляем время последнего входа
    await this.userRepository.update(user.user_id, {
      last_login: new Date(),
    });

    const payload: JwtPayload = {
      sub: user.user_id,
      username: user.username,
      email: user.email,
      role: userRole.role_name,
      role_id: user.role_id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: userRole.role_name,
        role_id: user.role_id,
      },
    };
  }

  async getProfile(userId: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      relations: ['role'],
      select: [
        'user_id',
        'username',
        'email',
        'first_name',
        'last_name',
        'phone',
        'role_id',
        'created_at',
        'last_login',
      ],
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const userRole = await this.userRoleRepository.findOne({
      where: { role_id: user.role_id },
    });

    return {
      ...user,
      role: userRole?.role_name || 'guest',
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { username, email, password, first_name, last_name, phone } = registerDto;

    // Проверяем уникальность username
    const existingUserByUsername = await this.userRepository.findOne({
      where: { username },
    });

    if (existingUserByUsername) {
      throw new ConflictException('Username уже занят');
    }

    // Проверяем уникальность email
    const existingUserByEmail = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUserByEmail) {
      throw new ConflictException('Email уже зарегистрирован');
    }

    // Получаем роль "user" (role_id = 3 по умолчанию)
    const userRole = await this.userRoleRepository.findOne({
      where: { role_name: 'user' },
    });

    if (!userRole) {
      throw new BadRequestException('Роль пользователя не найдена');
    }

    // Хешируем пароль (12 rounds bcrypt)
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Создаём нового пользователя
    const newUser = this.userRepository.create({
      username,
      email,
      password_hash,
      first_name,
      last_name,
      phone: phone || null,
      role_id: userRole.role_id, // По умолчанию user (role_id = 3)
    });

    try {
      const savedUser = await this.userRepository.save(newUser);

      // Автоматически логиним пользователя после регистрации
      const payload: JwtPayload = {
        sub: savedUser.user_id,
        username: savedUser.username,
        email: savedUser.email,
        role: userRole.role_name,
        role_id: savedUser.role_id,
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          user_id: savedUser.user_id,
          username: savedUser.username,
          email: savedUser.email,
          first_name: savedUser.first_name,
          last_name: savedUser.last_name,
          role: userRole.role_name,
          role_id: savedUser.role_id,
        },
      };
    } catch (error) {
      // Обработка ошибок базы данных
      if (error.code === '23505') {
        // PostgreSQL unique violation
        if (error.detail.includes('username')) {
          throw new ConflictException('Username уже занят');
        }
        if (error.detail.includes('email')) {
          throw new ConflictException('Email уже зарегистрирован');
        }
      }
      throw new BadRequestException('Ошибка при создании пользователя');
    }
  }

  async getUserDatabaseRole(role: string): Promise<string> {
    // Маппинг ролей приложения к ролям базы данных
    const roleMapping = {
      admin: 'restaurant_admin',
      manager: 'restaurant_manager',
      user: 'restaurant_user',
      guest: 'restaurant_guest',
    };

    return roleMapping[role] || 'restaurant_guest';
  }
}