import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { UpdateProfileDto } from '../users/dto/update-profile.dto';
import { ChangePasswordDto } from '../users/dto/change-password.dto';
import { Public } from './decorators/public.decorator';
import { TokenBlacklistService } from './token-blacklist.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenBlacklistService: TokenBlacklistService,
  ) {}

  @Post('login')
  @Public() // Публичный эндпоинт для авторизации
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @Public() // Публичный эндпоинт для регистрации
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован. Необходимо войти через /auth/login',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: { type: 'string', example: 'Пользователь успешно зарегистрирован. Пожалуйста, войдите в систему.' },
        user: {
          type: 'object',
          properties: {
            user_id: { type: 'string', example: 'd5669069-0e13-4c97-a07d-381c12f37142' },
            username: { type: 'string', example: 'new_user' },
            email: { type: 'string', example: 'user@example.com' },
            first_name: { type: 'string', example: 'Имя' },
            last_name: { type: 'string', example: 'Фамилия' },
            role: { type: 'string', example: 'user' },
            role_id: { type: 'number', example: 3 }
          }
        },
        created_at: { type: 'string', example: '2025-10-19T20:15:30.000Z' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation failed',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Username or email already exists',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение профиля пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Профиль пользователя успешно получен',
    schema: {
      type: 'object',
      properties: {
        user_id: { type: 'string', example: 'd5669069-0e13-4c97-a07d-381c12f37142' },
        username: { type: 'string', example: 'testuser123' },
        email: { type: 'string', example: 'test@example.com' },
        first_name: { type: 'string', example: 'John' },
        last_name: { type: 'string', example: 'Doe' },
        phone: { type: 'string', example: '+995591234567', nullable: true },
        role_id: { type: 'number', example: 3 },
        role: { type: 'string', example: 'user' },
        created_at: { type: 'string', format: 'date-time' },
        last_login: { type: 'string', format: 'date-time', nullable: true },
        country: { type: 'string', example: 'Грузия', nullable: true },
        city: { type: 'string', example: 'Тбилиси', nullable: true },
        street_address: { type: 'string', example: 'ул. Руставели 15', nullable: true }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован или токен недействителен',
  })
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.userId);
  }

  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновление профиля пользователя' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Профиль успешно обновлён',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        message: { type: 'string', example: 'Profile updated successfully' },
        updated_user_id: { type: 'string', example: 'd5669069-0e13-4c97-a07d-381c12f37142' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Неверные данные или не указано ни одного поля для обновления' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Пользователь не авторизован' 
  })
  async updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    // Проверяем, что передан хотя бы один параметр
    const hasData = Object.keys(dto).some(key => dto[key] !== undefined && dto[key] !== null);
    if (!hasData) {
      throw new BadRequestException('Необходимо указать хотя бы одно поле для обновления');
    }

    const userId = req.user.userId;
    return this.authService.updateProfile(userId, dto);
  }

    @Post('profile/password')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Смена пароля пользователя' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Пароль успешно изменён',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        message: { type: 'string', example: 'Profile updated successfully' },
        updated_user_id: { type: 'string', example: 'd5669069-0e13-4c97-a07d-381c12f37142' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Неверные данные пароля' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Текущий пароль неверный или пользователь не авторизован' 
  })
  async changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    const userId = req.user.userId;
    
    // Сначала меняем пароль
    const result = await this.authService.changePassword(userId, dto);
    
    // После успешной смены пароля добавляем текущий токен в blacklist
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      this.tokenBlacklistService.addToBlacklist(token);
    }
    
    return result;
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async logout(@Request() req) {
    // Извлекаем токен из заголовка Authorization
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      // Добавляем токен в blacklist
      this.tokenBlacklistService.addToBlacklist(token);
    }

    return {
      message: 'Logout successful',
      timestamp: new Date().toISOString(),
    };
  }
}