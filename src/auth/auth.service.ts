import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { UserRole } from '../entities/user-role.entity';
import { UserAddress } from '../entities/user-address.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthResponseDto, JwtPayload } from './dto/auth-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { UpdateProfileDto } from '../users/dto/update-profile.dto';
import { ChangePasswordDto } from '../users/dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(UserAddress)
    private userAddressRepository: Repository<UserAddress>,
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
    const user = await this.validateUser(loginDto.usernameOrEmail, loginDto.password);
    
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

    // Получаем адрес пользователя
    const userAddress = await this.userAddressRepository.findOne({
      where: { user_id: user.user_id },
      order: { created_at: 'DESC' },
      select: ['country', 'city', 'street_address'],
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
        phone: user.phone,
        role: userRole.role_name,
        role_id: user.role_id,
        // Добавляем данные адреса
        country: userAddress?.country || null,
        city: userAddress?.city || null,
        street_address: userAddress?.street_address || null,
      },
    };
  }

  async getProfile(userId: string): Promise<any> {
    // Получаем пользователя с ролью
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

    // Получаем роль пользователя
    const userRole = await this.userRoleRepository.findOne({
      where: { role_id: user.role_id },
    });

    // Получаем адрес пользователя из таблицы user_addresses
    const userAddress = await this.userAddressRepository.findOne({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      select: ['country', 'city', 'street_address'],
    });

    // Формируем полный профиль пользователя
    const profile = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      role_id: user.role_id,
      role: userRole?.role_name || 'guest',
      created_at: user.created_at,
      last_login: user.last_login,
      // Добавляем данные адреса если они есть
      country: userAddress?.country || null,
      city: userAddress?.city || null,
      street_address: userAddress?.street_address || null,
    };

    console.log('📋 Полный профиль пользователя:', profile);
    return profile;
  }

  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
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

      // Возвращаем информацию о пользователе без JWT токена
      // Пользователь должен войти отдельно через /auth/login
      return {
        status: 'success',
        message: 'Пользователь успешно зарегистрирован. Пожалуйста, войдите в систему.',
        user: {
          user_id: savedUser.user_id,
          username: savedUser.username,
          email: savedUser.email,
          first_name: savedUser.first_name,
          last_name: savedUser.last_name,
          role: userRole.role_name,
          role_id: savedUser.role_id,
        },
        created_at: savedUser.created_at.toISOString(),
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

  /**
   * Обновление профиля пользователя.
   * Вызывает транзакционную функцию на уровне БД `update_user_profile_transactional`.
   * Обновляет только переданные поля.
   */
  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<any> {
    // Вызываем функцию БД через raw query с DEFAULT для неуказанных полей
    const result = await this.userRepository.query(
      `SELECT update_user_profile_transactional(
        $1::uuid, 
        $2::text, 
        $3::text, 
        $4::text, 
        $5::text, 
        $6::text, 
        $7::text, 
        NULL::text
      ) as res`,
      [
        userId, 
        dto.first_name || null,
        dto.last_name || null,
        dto.phone || null,
        dto.country || null,
        dto.city || null,
        dto.street_address || null
      ],
    );

    return result[0]?.res || null;
  }

  /**
   * Смена пароля: проверяем текущий пароль, хешируем новый и вызываем updateProfile для записи в БД.
   */
  async changePassword(userId: string, dto: ChangePasswordDto): Promise<any> {
    // Получаем пользователя с хэшем
    const user = await this.userRepository.findOne({ where: { user_id: userId } });
    if (!user) throw new UnauthorizedException('Пользователь не найден');

    const match = await bcrypt.compare(dto.current_password, user.password_hash);
    if (!match) throw new BadRequestException('Текущий пароль неверный');

    const saltRounds = 12;
    const newHash = await bcrypt.hash(dto.new_password, saltRounds);

    // Используем update_user_profile_transactional для атомарного обновления password_hash
    const result = await this.userRepository.query(
      `SELECT update_user_profile_transactional(
        $1::uuid, 
        NULL::text, 
        NULL::text, 
        NULL::text, 
        NULL::text, 
        NULL::text, 
        NULL::text, 
        $2::text
      ) as res`,
      [userId, newHash],
    );

    return result[0]?.res || null;
  }

  async getAllUsers() {
    const users = await this.userRepository.find({
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
        'last_login'
      ]
    });

    return users.map(user => ({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      role: user.role?.role_name || 'user',
      role_id: user.role_id,
      created_at: user.created_at,
      last_login: user.last_login
    }));
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const { username, email, password, first_name, last_name, phone, role_id } = createUserDto;

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

    // Проверяем существование роли
    const userRole = await this.userRoleRepository.findOne({
      where: { role_id },
    });

    if (!userRole) {
      throw new BadRequestException('Указанная роль не найдена');
    }

    // Хешируем пароль
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
      role_id,
    });

    try {
      const savedUser = await this.userRepository.save(newUser);

      return {
        status: 'success',
        message: 'Пользователь успешно создан',
        user: {
          user_id: savedUser.user_id,
          username: savedUser.username,
          email: savedUser.email,
          first_name: savedUser.first_name,
          last_name: savedUser.last_name,
          role: userRole.role_name,
          role_id: savedUser.role_id,
        },
        created_at: savedUser.created_at.toISOString(),
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

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<any> {
    // Проверяем существование пользователя
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    // Проверяем уникальность username (если обновляется)
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (existingUser) {
        throw new ConflictException('Username уже занят');
      }
    }

    // Проверяем уникальность email (если обновляется)
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('Email уже зарегистрирован');
      }
    }

    // Проверяем существование роли (если обновляется)
    if (updateUserDto.role_id && updateUserDto.role_id !== user.role_id) {
      const userRole = await this.userRoleRepository.findOne({
        where: { role_id: updateUserDto.role_id },
      });
      if (!userRole) {
        throw new BadRequestException('Указанная роль не найдена');
      }
    }

    // Подготавливаем объект обновления
    const updateData: any = {};
    
    if (updateUserDto.username) updateData.username = updateUserDto.username;
    if (updateUserDto.email) updateData.email = updateUserDto.email;
    if (updateUserDto.first_name) updateData.first_name = updateUserDto.first_name;
    if (updateUserDto.last_name) updateData.last_name = updateUserDto.last_name;
    if (updateUserDto.phone !== undefined) updateData.phone = updateUserDto.phone || null;
    if (updateUserDto.role_id) updateData.role_id = updateUserDto.role_id;
    
    // Хешируем новый пароль если он предоставлен
    if (updateUserDto.password) {
      const saltRounds = 12;
      updateData.password_hash = await bcrypt.hash(updateUserDto.password, saltRounds);
    }

    try {
      await this.userRepository.update(userId, updateData);

      return {
        status: 'success',
        message: 'Пользователь успешно обновлён',
        updated_user_id: userId,
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
      throw new BadRequestException('Ошибка при обновлении пользователя');
    }
  }

  async deleteUser(userId: string): Promise<any> {
    // Проверяем существование пользователя
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    try {
      await this.userRepository.delete(userId);

      return {
        status: 'success',
        message: 'Пользователь успешно удалён',
        deleted_user_id: userId,
      };
    } catch (error) {
      throw new BadRequestException('Ошибка при удалении пользователя');
    }
  }
}
