"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../entities/user.entity");
const user_role_entity_1 = require("../entities/user-role.entity");
const user_address_entity_1 = require("../entities/user-address.entity");
let AuthService = class AuthService {
    constructor(userRepository, userRoleRepository, userAddressRepository, jwtService) {
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.userAddressRepository = userAddressRepository;
        this.jwtService = jwtService;
    }
    async validateUser(username, password) {
        console.log('🔍 Attempting to validate user:', username);
        const user = await this.userRepository.findOne({
            where: [
                { username },
                { email: username },
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
    async login(loginDto) {
        const user = await this.validateUser(loginDto.usernameOrEmail, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Неверный логин или пароль');
        }
        const userRole = await this.userRoleRepository.findOne({
            where: { role_id: user.role_id },
        });
        if (!userRole) {
            throw new common_1.UnauthorizedException('Роль пользователя не найдена');
        }
        await this.userRepository.update(user.user_id, {
            last_login: new Date(),
        });
        const userAddress = await this.userAddressRepository.findOne({
            where: { user_id: user.user_id },
            order: { created_at: 'DESC' },
            select: ['country', 'city', 'street_address'],
        });
        const payload = {
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
                country: userAddress?.country || null,
                city: userAddress?.city || null,
                street_address: userAddress?.street_address || null,
            },
        };
    }
    async getProfile(userId) {
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
            throw new common_1.UnauthorizedException('Пользователь не найден');
        }
        const userRole = await this.userRoleRepository.findOne({
            where: { role_id: user.role_id },
        });
        const userAddress = await this.userAddressRepository.findOne({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
            select: ['country', 'city', 'street_address'],
        });
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
            country: userAddress?.country || null,
            city: userAddress?.city || null,
            street_address: userAddress?.street_address || null,
        };
        console.log('📋 Полный профиль пользователя:', profile);
        return profile;
    }
    async register(registerDto) {
        const { username, email, password, first_name, last_name, phone } = registerDto;
        const existingUserByUsername = await this.userRepository.findOne({
            where: { username },
        });
        if (existingUserByUsername) {
            throw new common_1.ConflictException('Username уже занят');
        }
        const existingUserByEmail = await this.userRepository.findOne({
            where: { email },
        });
        if (existingUserByEmail) {
            throw new common_1.ConflictException('Email уже зарегистрирован');
        }
        const userRole = await this.userRoleRepository.findOne({
            where: { role_name: 'user' },
        });
        if (!userRole) {
            throw new common_1.BadRequestException('Роль пользователя не найдена');
        }
        const saltRounds = 12;
        const password_hash = await bcrypt.hash(password, saltRounds);
        const newUser = this.userRepository.create({
            username,
            email,
            password_hash,
            first_name,
            last_name,
            phone: phone || null,
            role_id: userRole.role_id,
        });
        try {
            const savedUser = await this.userRepository.save(newUser);
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
        }
        catch (error) {
            if (error.code === '23505') {
                if (error.detail.includes('username')) {
                    throw new common_1.ConflictException('Username уже занят');
                }
                if (error.detail.includes('email')) {
                    throw new common_1.ConflictException('Email уже зарегистрирован');
                }
            }
            throw new common_1.BadRequestException('Ошибка при создании пользователя');
        }
    }
    async getUserDatabaseRole(role) {
        const roleMapping = {
            admin: 'restaurant_admin',
            manager: 'restaurant_manager',
            user: 'restaurant_user',
            guest: 'restaurant_guest',
        };
        return roleMapping[role] || 'restaurant_guest';
    }
    async updateProfile(userId, dto) {
        const result = await this.userRepository.query(`SELECT update_user_profile_transactional(
        $1::uuid, 
        $2::text, 
        $3::text, 
        $4::text, 
        $5::text, 
        $6::text, 
        $7::text, 
        NULL::text
      ) as res`, [
            userId,
            dto.first_name || null,
            dto.last_name || null,
            dto.phone || null,
            dto.country || null,
            dto.city || null,
            dto.street_address || null
        ]);
        return result[0]?.res || null;
    }
    async changePassword(userId, dto) {
        const user = await this.userRepository.findOne({ where: { user_id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException('Пользователь не найден');
        const match = await bcrypt.compare(dto.current_password, user.password_hash);
        if (!match)
            throw new common_1.BadRequestException('Текущий пароль неверный');
        const saltRounds = 12;
        const newHash = await bcrypt.hash(dto.new_password, saltRounds);
        const result = await this.userRepository.query(`SELECT update_user_profile_transactional(
        $1::uuid, 
        NULL::text, 
        NULL::text, 
        NULL::text, 
        NULL::text, 
        NULL::text, 
        NULL::text, 
        $2::text
      ) as res`, [userId, newHash]);
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
    async createUser(createUserDto) {
        const { username, email, password, first_name, last_name, phone, role_id } = createUserDto;
        const existingUserByUsername = await this.userRepository.findOne({
            where: { username },
        });
        if (existingUserByUsername) {
            throw new common_1.ConflictException('Username уже занят');
        }
        const existingUserByEmail = await this.userRepository.findOne({
            where: { email },
        });
        if (existingUserByEmail) {
            throw new common_1.ConflictException('Email уже зарегистрирован');
        }
        const userRole = await this.userRoleRepository.findOne({
            where: { role_id },
        });
        if (!userRole) {
            throw new common_1.BadRequestException('Указанная роль не найдена');
        }
        const saltRounds = 12;
        const password_hash = await bcrypt.hash(password, saltRounds);
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
        }
        catch (error) {
            if (error.code === '23505') {
                if (error.detail.includes('username')) {
                    throw new common_1.ConflictException('Username уже занят');
                }
                if (error.detail.includes('email')) {
                    throw new common_1.ConflictException('Email уже зарегистрирован');
                }
            }
            throw new common_1.BadRequestException('Ошибка при создании пользователя');
        }
    }
    async updateUser(userId, updateUserDto) {
        const user = await this.userRepository.findOne({
            where: { user_id: userId },
        });
        if (!user) {
            throw new common_1.BadRequestException('Пользователь не найден');
        }
        if (updateUserDto.username && updateUserDto.username !== user.username) {
            const existingUser = await this.userRepository.findOne({
                where: { username: updateUserDto.username },
            });
            if (existingUser) {
                throw new common_1.ConflictException('Username уже занят');
            }
        }
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.userRepository.findOne({
                where: { email: updateUserDto.email },
            });
            if (existingUser) {
                throw new common_1.ConflictException('Email уже зарегистрирован');
            }
        }
        if (updateUserDto.role_id && updateUserDto.role_id !== user.role_id) {
            const userRole = await this.userRoleRepository.findOne({
                where: { role_id: updateUserDto.role_id },
            });
            if (!userRole) {
                throw new common_1.BadRequestException('Указанная роль не найдена');
            }
        }
        const updateData = {};
        if (updateUserDto.username)
            updateData.username = updateUserDto.username;
        if (updateUserDto.email)
            updateData.email = updateUserDto.email;
        if (updateUserDto.first_name)
            updateData.first_name = updateUserDto.first_name;
        if (updateUserDto.last_name)
            updateData.last_name = updateUserDto.last_name;
        if (updateUserDto.phone !== undefined)
            updateData.phone = updateUserDto.phone || null;
        if (updateUserDto.role_id)
            updateData.role_id = updateUserDto.role_id;
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
        }
        catch (error) {
            if (error.code === '23505') {
                if (error.detail.includes('username')) {
                    throw new common_1.ConflictException('Username уже занят');
                }
                if (error.detail.includes('email')) {
                    throw new common_1.ConflictException('Email уже зарегистрирован');
                }
            }
            throw new common_1.BadRequestException('Ошибка при обновлении пользователя');
        }
    }
    async deleteUser(userId) {
        const user = await this.userRepository.findOne({
            where: { user_id: userId },
        });
        if (!user) {
            throw new common_1.BadRequestException('Пользователь не найден');
        }
        try {
            await this.userRepository.delete(userId);
            return {
                status: 'success',
                message: 'Пользователь успешно удалён',
                deleted_user_id: userId,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Ошибка при удалении пользователя');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_role_entity_1.UserRole)),
    __param(2, (0, typeorm_1.InjectRepository)(user_address_entity_1.UserAddress)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map