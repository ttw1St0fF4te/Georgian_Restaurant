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
exports.ReservationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const reservations_service_1 = require("./reservations.service");
const dto_1 = require("./dto");
let ReservationsController = class ReservationsController {
    constructor(reservationsService) {
        this.reservationsService = reservationsService;
    }
    async createReservation(req, createReservationDto) {
        const userId = req.user.userId;
        return this.reservationsService.createReservation(userId, createReservationDto);
    }
    async createReservationForUser(createReservationForUserDto) {
        return this.reservationsService.createReservation(createReservationForUserDto.user_id, createReservationForUserDto);
    }
    async getAllReservations() {
        return this.reservationsService.getAllReservations();
    }
    async getActiveReservations() {
        return this.reservationsService.getActiveReservations();
    }
    async getInactiveReservations() {
        return this.reservationsService.getInactiveReservations();
    }
    async getTableAvailability(restaurantId, tableId, date) {
        return this.reservationsService.getActiveReservationsByRestaurantDateTable(restaurantId, date, tableId);
    }
    async getUserReservations(req) {
        const userId = req.user.userId;
        return this.reservationsService.getUserReservations(userId);
    }
    async getUserActiveReservations(req) {
        const userId = req.user.userId;
        return this.reservationsService.getUserActiveReservations(userId);
    }
    async confirmReservation(req, reservationId) {
        const userId = req.user.userId;
        return this.reservationsService.confirmReservation(userId, reservationId);
    }
    async cancelReservation(req, reservationId) {
        const userId = req.user.userId;
        return this.reservationsService.cancelReservation(userId, reservationId);
    }
    async confirmReservationForManager(reservationId) {
        return this.reservationsService.confirmReservationForManager(reservationId);
    }
    async cancelReservationForManager(reservationId) {
        return this.reservationsService.cancelReservationForManager(reservationId);
    }
};
exports.ReservationsController = ReservationsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, roles_decorator_1.Roles)('user', 'manager', 'admin'),
    (0, swagger_1.ApiOperation)({
        summary: 'Создать новое бронирование столика',
        description: `
    Создает новое бронирование столика с проверкой всех бизнес-правил:
    - Один пользователь может иметь только одно активное бронирование
    - Столик должен принадлежать выбранному ресторану
    - Количество гостей не должно превышать вместимость столика
    - Бронирование возможно только в рабочие часы ресторана
    - Нельзя забронировать занятое время
    - Бронирование доступно с текущей даты на месяц вперед
    - Продолжительность от 1 до 8 часов
    `,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Бронирование успешно создано',
        type: dto_1.ReservationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Неверные данные или нарушение бизнес-правил',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 400 },
                message: {
                    type: 'string',
                    example: 'Количество гостей превышает вместимость столика',
                },
                error: { type: 'string', example: 'Bad Request' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Конфликт бронирования',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 409 },
                message: {
                    type: 'string',
                    example: 'У вас уже есть активное бронирование',
                },
                error: { type: 'string', example: 'Conflict' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Ресторан или столик не найден',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 404 },
                message: {
                    type: 'string',
                    example: 'Столик не найден или не принадлежит выбранному ресторану',
                },
                error: { type: 'string', example: 'Not Found' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Неавторизованный доступ',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 401 },
                message: { type: 'string', example: 'Unauthorized' },
            },
        },
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateReservationDto]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "createReservation", null);
__decorate([
    (0, common_1.Post)('for-user'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, roles_decorator_1.Roles)('manager', 'admin'),
    (0, swagger_1.ApiOperation)({
        summary: 'Создать бронирование для пользователя (только менеджеры и администраторы)',
        description: `
    Создает новое бронирование для указанного пользователя. Доступно только менеджерам и администраторам.
    Проверяет все те же бизнес-правила, что и обычное создание бронирования.
    `,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Бронирование успешно создано',
        type: dto_1.ReservationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Неверные данные или нарушение бизнес-правил',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateReservationForUserDto]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "createReservationForUser", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить все бронирования',
        description: 'Возвращает список всех бронирований в системе (только для админов и менеджеров)',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Список всех бронирований',
        type: [dto_1.ReservationResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "getAllReservations", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить все активные бронирования',
        description: 'Возвращает список активных бронирований (unconfirmed, confirmed, started)',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Список активных бронирований',
        type: [dto_1.ReservationResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "getActiveReservations", null);
__decorate([
    (0, common_1.Get)('inactive'),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить все неактивные бронирования',
        description: 'Возвращает список завершенных и отмененных бронирований',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Список неактивных бронирований',
        type: [dto_1.ReservationResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "getInactiveReservations", null);
__decorate([
    (0, common_1.Get)('availability/:restaurantId/:tableId'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить доступность столика на определенную дату',
        description: 'Возвращает активные бронирования и занятые временные слоты для конкретного столика на выбранную дату',
    }),
    (0, swagger_1.ApiParam)({
        name: 'restaurantId',
        description: 'ID ресторана',
        example: 1,
    }),
    (0, swagger_1.ApiParam)({
        name: 'tableId',
        description: 'ID столика',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'date',
        description: 'Дата для проверки доступности (YYYY-MM-DD)',
        example: '2025-10-25',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Информация о доступности столика',
        type: dto_1.RestaurantTableAvailabilityDto,
    }),
    __param(0, (0, common_1.Param)('restaurantId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('tableId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "getTableAvailability", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, roles_decorator_1.Roles)('user', 'manager', 'admin'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить бронирования текущего пользователя',
        description: 'Возвращает все бронирования авторизованного пользователя',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Список бронирований пользователя',
        type: [dto_1.ReservationResponseDto],
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "getUserReservations", null);
__decorate([
    (0, common_1.Get)('my/active'),
    (0, roles_decorator_1.Roles)('user', 'manager', 'admin'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить активные бронирования текущего пользователя',
        description: 'Возвращает активные бронирования авторизованного пользователя',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Список активных бронирований пользователя',
        type: [dto_1.ReservationResponseDto],
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "getUserActiveReservations", null);
__decorate([
    (0, common_1.Patch)(':reservationId/confirm'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)('user', 'manager', 'admin'),
    (0, swagger_1.ApiOperation)({
        summary: 'Подтвердить бронирование',
        description: `
    Подтверждает бронирование пользователя. Возможно только для бронирований со статусом 'unconfirmed'.
    При подтверждении статус меняется на 'confirmed' и устанавливается время подтверждения.
    `,
    }),
    (0, swagger_1.ApiParam)({
        name: 'reservationId',
        description: 'ID бронирования для подтверждения',
        example: 'uuid-string',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Бронирование успешно подтверждено',
        type: dto_1.ReservationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Нельзя подтвердить бронирование с текущим статусом',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 400 },
                message: {
                    type: 'string',
                    example: 'Можно подтвердить только неподтвержденные бронирования. Текущий статус: confirmed',
                },
                error: { type: 'string', example: 'Bad Request' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Бронирование не найдено или не принадлежит пользователю',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 404 },
                message: {
                    type: 'string',
                    example: 'Бронирование не найдено или не принадлежит вам',
                },
                error: { type: 'string', example: 'Not Found' },
            },
        },
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('reservationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "confirmReservation", null);
__decorate([
    (0, common_1.Patch)(':reservationId/cancel'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)('user', 'manager', 'admin'),
    (0, swagger_1.ApiOperation)({
        summary: 'Отменить бронирование',
        description: `
    Отменяет бронирование пользователя. Возможно только для бронирований со статусом 'unconfirmed'.
    При отмене статус меняется на 'cancelled'.
    `,
    }),
    (0, swagger_1.ApiParam)({
        name: 'reservationId',
        description: 'ID бронирования для отмены',
        example: 'uuid-string',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Бронирование успешно отменено',
        type: dto_1.ReservationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Нельзя отменить бронирование с текущим статусом',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 400 },
                message: {
                    type: 'string',
                    example: 'Можно отменить только неподтвержденные бронирования. Текущий статус: confirmed',
                },
                error: { type: 'string', example: 'Bad Request' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Бронирование не найдено или не принадлежит пользователю',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 404 },
                message: {
                    type: 'string',
                    example: 'Бронирование не найдено или не принадлежит вам',
                },
                error: { type: 'string', example: 'Not Found' },
            },
        },
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('reservationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "cancelReservation", null);
__decorate([
    (0, common_1.Patch)('manager/:reservationId/confirm'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)('manager', 'admin'),
    (0, swagger_1.ApiOperation)({
        summary: 'Подтвердить бронирование (только для менеджеров)',
        description: `
    Подтверждает любое бронирование в системе. Доступно только менеджерам и администраторам.
    Возможно только для бронирований со статусом 'unconfirmed'.
    При подтверждении статус меняется на 'confirmed' и устанавливается время подтверждения.
    `,
    }),
    (0, swagger_1.ApiParam)({
        name: 'reservationId',
        description: 'ID бронирования для подтверждения',
        example: 'uuid-string',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Бронирование успешно подтверждено',
        type: dto_1.ReservationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Нельзя подтвердить бронирование с текущим статусом',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Бронирование не найдено',
    }),
    __param(0, (0, common_1.Param)('reservationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "confirmReservationForManager", null);
__decorate([
    (0, common_1.Patch)('manager/:reservationId/cancel'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)('manager', 'admin'),
    (0, swagger_1.ApiOperation)({
        summary: 'Отменить бронирование (только для менеджеров)',
        description: `
    Отменяет любое бронирование в системе. Доступно только менеджерам и администраторам.
    Возможно только для бронирований со статусом 'unconfirmed'.
    При отмене статус меняется на 'cancelled'.
    `,
    }),
    (0, swagger_1.ApiParam)({
        name: 'reservationId',
        description: 'ID бронирования для отмены',
        example: 'uuid-string',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Бронирование успешно отменено',
        type: dto_1.ReservationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Нельзя отменить бронирование с текущим статусом',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Бронирование не найдено',
    }),
    __param(0, (0, common_1.Param)('reservationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "cancelReservationForManager", null);
exports.ReservationsController = ReservationsController = __decorate([
    (0, swagger_1.ApiTags)('reservations'),
    (0, common_1.Controller)('reservations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [reservations_service_1.ReservationsService])
], ReservationsController);
//# sourceMappingURL=reservations.controller.js.map