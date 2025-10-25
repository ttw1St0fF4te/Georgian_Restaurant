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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const register_dto_1 = require("./dto/register.dto");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const auth_response_dto_1 = require("./dto/auth-response.dto");
const update_profile_dto_1 = require("../users/dto/update-profile.dto");
const change_password_dto_1 = require("../users/dto/change-password.dto");
const public_decorator_1 = require("./decorators/public.decorator");
const token_blacklist_service_1 = require("./token-blacklist.service");
let AuthController = class AuthController {
    constructor(authService, tokenBlacklistService) {
        this.authService = authService;
        this.tokenBlacklistService = tokenBlacklistService;
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async getProfile(req) {
        return this.authService.getProfile(req.user.userId);
    }
    async updateProfile(req, dto) {
        const hasData = Object.keys(dto).some(key => dto[key] !== undefined && dto[key] !== null);
        if (!hasData) {
            throw new common_1.BadRequestException('Необходимо указать хотя бы одно поле для обновления');
        }
        const userId = req.user.userId;
        return this.authService.updateProfile(userId, dto);
    }
    async changePassword(req, dto) {
        const userId = req.user.userId;
        const result = await this.authService.changePassword(userId, dto);
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            this.tokenBlacklistService.addToBlacklist(token);
        }
        return result;
    }
    async getAllUsers(req) {
        if (req.user.role !== 'manager' && req.user.role !== 'admin') {
            throw new common_1.BadRequestException('Недостаточно прав доступа');
        }
        return this.authService.getAllUsers();
    }
    async logout(req) {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            this.tokenBlacklistService.addToBlacklist(token);
        }
        return {
            message: 'Logout successful',
            timestamp: new Date().toISOString(),
        };
    }
    async createUser(req, createUserDto) {
        if (req.user.role !== 'admin') {
            throw new common_1.BadRequestException('Недостаточно прав доступа');
        }
        return this.authService.createUser(createUserDto);
    }
    async updateUser(req, userId, updateUserDto) {
        if (req.user.role !== 'admin') {
            throw new common_1.BadRequestException('Недостаточно прав доступа');
        }
        const hasData = Object.keys(updateUserDto).some(key => updateUserDto[key] !== undefined && updateUserDto[key] !== null);
        if (!hasData) {
            throw new common_1.BadRequestException('Необходимо указать хотя бы одно поле для обновления');
        }
        return this.authService.updateUser(userId, updateUserDto);
    }
    async deleteUser(req, userId) {
        if (req.user.role !== 'admin') {
            throw new common_1.BadRequestException('Недостаточно прав доступа');
        }
        if (req.user.userId === userId) {
            throw new common_1.BadRequestException('Нельзя удалить собственный аккаунт');
        }
        return this.authService.deleteUser(userId);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'User login' }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login successful',
        type: auth_response_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid credentials',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'User registration' }),
    (0, swagger_1.ApiBody)({ type: register_dto_1.RegisterDto }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Validation failed',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict - Username or email already exists',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Получение профиля пользователя' }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Пользователь не авторизован или токен недействителен',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('profile'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Обновление профиля пользователя' }),
    (0, swagger_1.ApiBody)({ type: update_profile_dto_1.UpdateProfileDto }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Неверные данные или не указано ни одного поля для обновления'
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Пользователь не авторизован'
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)('profile/password'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Смена пароля пользователя' }),
    (0, swagger_1.ApiBody)({ type: change_password_dto_1.ChangePasswordDto }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Неверные данные пароля'
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Текущий пароль неверный или пользователь не авторизован'
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Получение списка всех пользователей (только для менеджеров и администраторов)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Список пользователей успешно получен',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    user_id: { type: 'string', example: 'd5669069-0e13-4c97-a07d-381c12f37142' },
                    username: { type: 'string', example: 'testuser123' },
                    email: { type: 'string', example: 'test@example.com' },
                    first_name: { type: 'string', example: 'John' },
                    last_name: { type: 'string', example: 'Doe' },
                    phone: { type: 'string', example: '+995591234567', nullable: true },
                    role: { type: 'string', example: 'user' },
                    created_at: { type: 'string', format: 'date-time' }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Пользователь не авторизован',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Недостаточно прав доступа',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'User logout' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Logout successful',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('admin/users'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Создание нового пользователя (только для администраторов)' }),
    (0, swagger_1.ApiBody)({ type: create_user_dto_1.CreateUserDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Пользователь успешно создан',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'success' },
                message: { type: 'string', example: 'Пользователь успешно создан' },
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
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Неверные данные',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Пользователь не авторизован',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Недостаточно прав доступа',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Пользователь с таким именем или email уже существует',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createUser", null);
__decorate([
    (0, common_1.Put)('admin/users/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Обновление пользователя (только для администраторов)' }),
    (0, swagger_1.ApiBody)({ type: update_user_dto_1.UpdateUserDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Пользователь успешно обновлён',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'success' },
                message: { type: 'string', example: 'Пользователь успешно обновлён' },
                updated_user_id: { type: 'string', example: 'd5669069-0e13-4c97-a07d-381c12f37142' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Неверные данные или пользователь не найден',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Пользователь не авторизован',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Недостаточно прав доступа',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)('admin/users/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Удаление пользователя (только для администраторов)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Пользователь успешно удалён',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'success' },
                message: { type: 'string', example: 'Пользователь успешно удалён' },
                deleted_user_id: { type: 'string', example: 'd5669069-0e13-4c97-a07d-381c12f37142' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Пользователь не найден или не может быть удалён',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Пользователь не авторизован',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Недостаточно прав доступа',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteUser", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        token_blacklist_service_1.TokenBlacklistService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map