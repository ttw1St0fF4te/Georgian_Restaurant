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
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cart_service_1 = require("./cart.service");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const add_to_cart_dto_1 = require("./dto/add-to-cart.dto");
const update_cart_item_dto_1 = require("./dto/update-cart-item.dto");
const cart_response_dto_1 = require("./dto/cart-response.dto");
let CartController = class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }
    async getCart(userId) {
        return this.cartService.getUserCart(userId);
    }
    async addToCart(userId, addToCartDto) {
        return this.cartService.addToCart(userId, addToCartDto);
    }
    async updateCartItem(userId, itemId, updateCartItemDto) {
        return this.cartService.updateCartItem(userId, itemId, updateCartItemDto);
    }
    async removeFromCart(userId, itemId) {
        return this.cartService.removeFromCart(userId, itemId);
    }
    async clearCart(userId) {
        return this.cartService.clearCart(userId);
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить корзину пользователя',
        description: 'Возвращает текущую корзину пользователя со всеми товарами или создает новую пустую корзину'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Корзина успешно получена',
        type: cart_response_dto_1.CartResponseDto,
    }),
    __param(0, (0, get_user_decorator_1.GetUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)('add'),
    (0, swagger_1.ApiOperation)({
        summary: 'Добавить товар в корзину',
        description: 'Добавляет указанное количество блюда в корзину. Если блюдо уже есть в корзине, увеличивает его количество.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Товар успешно добавлен в корзину',
        type: cart_response_dto_1.CartResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Некорректные данные или превышено максимальное количество товара',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Блюдо не найдено или недоступно',
    }),
    __param(0, (0, get_user_decorator_1.GetUser)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_to_cart_dto_1.AddToCartDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "addToCart", null);
__decorate([
    (0, common_1.Put)('item/:itemId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Обновить количество товара в корзине',
        description: 'Изменяет количество указанного блюда в корзине. Если количество равно 0, товар удаляется из корзины.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'itemId',
        description: 'ID блюда в меню',
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Количество товара успешно обновлено',
        type: cart_response_dto_1.CartResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Некорректное количество',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Товар не найден в корзине',
    }),
    __param(0, (0, get_user_decorator_1.GetUser)('userId')),
    __param(1, (0, common_1.Param)('itemId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, update_cart_item_dto_1.UpdateCartItemDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "updateCartItem", null);
__decorate([
    (0, common_1.Delete)('item/:itemId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Удалить товар из корзины',
        description: 'Полностью удаляет указанное блюдо из корзины, независимо от количества'
    }),
    (0, swagger_1.ApiParam)({
        name: 'itemId',
        description: 'ID блюда в меню',
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Товар успешно удален из корзины',
        type: cart_response_dto_1.CartResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Товар не найден в корзине',
    }),
    __param(0, (0, get_user_decorator_1.GetUser)('userId')),
    __param(1, (0, common_1.Param)('itemId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "removeFromCart", null);
__decorate([
    (0, common_1.Delete)('clear'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Очистить корзину полностью',
        description: 'Удаляет все товары из корзины пользователя и саму корзину'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Корзина успешно очищена',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Корзина успешно очищена',
                },
            },
        },
    }),
    __param(0, (0, get_user_decorator_1.GetUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "clearCart", null);
exports.CartController = CartController = __decorate([
    (0, swagger_1.ApiTags)('Cart'),
    (0, common_1.Controller)('cart'),
    (0, roles_decorator_1.Roles)('user'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map