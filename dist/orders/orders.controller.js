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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const orders_service_1 = require("./orders.service");
const dto_1 = require("./dto");
let OrdersController = class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async createOrder(req, createOrderDto) {
        const userId = req.user.userId;
        return this.ordersService.createOrder(userId, createOrderDto);
    }
    async getUserOrders(req) {
        const userId = req.user.userId;
        return this.ordersService.getUserOrders(userId);
    }
    async getUserAddress(req) {
        const userId = req.user.userId;
        return this.ordersService.getUserAddress(userId);
    }
    async getOrder(orderId) {
        return this.ordersService.getOrderById(orderId);
    }
    async getAllOrders() {
        return this.ordersService.getAllOrders();
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, roles_decorator_1.Roles)('user', 'manager', 'admin'),
    (0, swagger_1.ApiOperation)({
        summary: 'Создать заказ из корзины',
        description: `
    Создает заказ на основе содержимого корзины пользователя.
    
    Типы заказов:
    - delivery: Доставка на дом (требуется адрес доставки, взимается fee 5%)
    - dine_in: Заказ в ресторане (требуется активное бронирование со статусом 'started')
    
    Валидация:
    - Корзина не должна быть пустой
    - Для delivery: все адресные поля обязательны, должен быть активный ресторан в городе доставки
    - Для dine_in: reservation_id обязателен, бронирование должно быть в статусе 'started'
    - После создания заказа корзина очищается
    `,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Заказ успешно создан',
        type: dto_1.OrderResponseDto,
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
                    example: 'Корзина пуста',
                },
                error: { type: 'string', example: 'Bad Request' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Корзина или бронирование не найдено',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 404 },
                message: {
                    type: 'string',
                    example: 'Корзина пользователя не найдена',
                },
                error: { type: 'string', example: 'Not Found' },
            },
        },
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, roles_decorator_1.Roles)('user', 'manager', 'admin'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить заказы текущего пользователя',
        description: 'Возвращает все заказы авторизованного пользователя',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Список заказов пользователя',
        type: [dto_1.OrderResponseDto],
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getUserOrders", null);
__decorate([
    (0, common_1.Get)('my/address'),
    (0, roles_decorator_1.Roles)('user', 'manager', 'admin'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить адрес пользователя для автозаполнения',
        description: 'Возвращает адрес пользователя для автозаполнения при создании заказа с доставкой',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Адрес пользователя',
        schema: {
            type: 'object',
            properties: {
                country: { type: 'string', example: 'Грузия' },
                city: { type: 'string', example: 'Тбилиси' },
                street_address: { type: 'string', example: 'ул. Руставели, 15' },
            },
        },
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getUserAddress", null);
__decorate([
    (0, common_1.Get)(':orderId'),
    (0, roles_decorator_1.Roles)('user', 'manager', 'admin'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить заказ по ID',
        description: 'Возвращает детальную информацию о заказе',
    }),
    (0, swagger_1.ApiParam)({
        name: 'orderId',
        description: 'ID заказа',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Информация о заказе',
        type: dto_1.OrderResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Заказ не найден',
    }),
    __param(0, (0, common_1.Param)('orderId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getOrder", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить все заказы',
        description: 'Возвращает все заказы в системе (только для админов и менеджеров)',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Список всех заказов',
        type: [dto_1.OrderResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getAllOrders", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('orders'),
    (0, common_1.Controller)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map