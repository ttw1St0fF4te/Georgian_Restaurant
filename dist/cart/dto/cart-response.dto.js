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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartResponseDto = exports.CartItemResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CartItemResponseDto {
}
exports.CartItemResponseDto = CartItemResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID элемента корзины',
        example: 1,
    }),
    __metadata("design:type", Number)
], CartItemResponseDto.prototype, "cart_item_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID блюда',
        example: 1,
    }),
    __metadata("design:type", Number)
], CartItemResponseDto.prototype, "item_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Название блюда',
        example: 'Хачапури по-аджарски',
    }),
    __metadata("design:type", String)
], CartItemResponseDto.prototype, "item_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Описание блюда',
        example: 'Традиционная лодочка из теста с сыром, маслом и яйцом',
    }),
    __metadata("design:type", String)
], CartItemResponseDto.prototype, "item_description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Цена за единицу',
        example: 18.50,
    }),
    __metadata("design:type", Number)
], CartItemResponseDto.prototype, "unit_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Количество в корзине',
        example: 2,
    }),
    __metadata("design:type", Number)
], CartItemResponseDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Общая стоимость позиции (цена * количество)',
        example: 37.00,
    }),
    __metadata("design:type", Number)
], CartItemResponseDto.prototype, "total_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Время добавления в корзину',
        example: '2024-10-20T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], CartItemResponseDto.prototype, "added_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL изображения блюда (может быть null)',
        example: 'https://example.com/khachapuri.jpg',
        nullable: true,
    }),
    __metadata("design:type", String)
], CartItemResponseDto.prototype, "image_url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Категория блюда',
        example: 'Горячие блюда',
    }),
    __metadata("design:type", String)
], CartItemResponseDto.prototype, "category_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Вегетарианское блюдо',
        example: true,
    }),
    __metadata("design:type", Boolean)
], CartItemResponseDto.prototype, "is_vegetarian", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Острое блюдо',
        example: false,
    }),
    __metadata("design:type", Boolean)
], CartItemResponseDto.prototype, "is_spicy", void 0);
class CartResponseDto {
}
exports.CartResponseDto = CartResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID корзины',
        example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    }),
    __metadata("design:type", String)
], CartResponseDto.prototype, "cart_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID пользователя',
        example: 'f1e2d3c4-b5a6-9h8g-7j6i-5k4l3m2n1o0p',
    }),
    __metadata("design:type", String)
], CartResponseDto.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Список товаров в корзине',
        type: [CartItemResponseDto],
    }),
    __metadata("design:type", Array)
], CartResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Общее количество единиц товаров в корзине',
        example: 5,
    }),
    __metadata("design:type", Number)
], CartResponseDto.prototype, "total_items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Общая стоимость корзины',
        example: 87.50,
    }),
    __metadata("design:type", Number)
], CartResponseDto.prototype, "total_amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Время создания корзины',
        example: '2024-10-20T09:00:00.000Z',
    }),
    __metadata("design:type", Date)
], CartResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Время последнего обновления корзины',
        example: '2024-10-20T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], CartResponseDto.prototype, "updated_at", void 0);
//# sourceMappingURL=cart-response.dto.js.map