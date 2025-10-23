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
exports.OrderItemResponseDto = exports.OrderResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const order_entity_1 = require("../../entities/order.entity");
class OrderResponseDto {
}
exports.OrderResponseDto = OrderResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID заказа',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "order_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID пользователя',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Тип заказа',
        enum: order_entity_1.OrderType,
        example: 'delivery'
    }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "order_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Страна доставки',
        example: 'Грузия',
        nullable: true
    }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "delivery_country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Город доставки',
        example: 'Тбилиси',
        nullable: true
    }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "delivery_city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Адрес доставки',
        example: 'ул. Руставели, 15, кв. 10',
        nullable: true
    }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "delivery_street_address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Телефон доставки',
        example: '+995555123456',
        nullable: true
    }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "delivery_phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID бронирования',
        example: '123e4567-e89b-12d3-a456-426614174000',
        nullable: true
    }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "reservation_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Стоимость товаров',
        example: 45.50
    }),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Стоимость доставки',
        example: 2.28
    }),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "delivery_fee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Общая стоимость',
        example: 47.78
    }),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "total_amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата создания заказа',
        example: '2025-10-23T10:30:00Z'
    }),
    __metadata("design:type", Date)
], OrderResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата последнего обновления',
        example: '2025-10-23T10:30:00Z'
    }),
    __metadata("design:type", Date)
], OrderResponseDto.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Позиции заказа',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                order_item_id: { type: 'number', example: 1 },
                item_id: { type: 'number', example: 5 },
                item_name: { type: 'string', example: 'Хачапури по-аджарски' },
                quantity: { type: 'number', example: 2 },
                unit_price: { type: 'number', example: 18.50 },
                total_price: { type: 'number', example: 37.00 }
            }
        }
    }),
    __metadata("design:type", Array)
], OrderResponseDto.prototype, "order_items", void 0);
class OrderItemResponseDto {
}
exports.OrderItemResponseDto = OrderItemResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID позиции заказа',
        example: 1
    }),
    __metadata("design:type", Number)
], OrderItemResponseDto.prototype, "order_item_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID блюда',
        example: 5
    }),
    __metadata("design:type", Number)
], OrderItemResponseDto.prototype, "item_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Название блюда',
        example: 'Хачапури по-аджарски'
    }),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "item_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Количество',
        example: 2
    }),
    __metadata("design:type", Number)
], OrderItemResponseDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Цена за единицу',
        example: 18.50
    }),
    __metadata("design:type", Number)
], OrderItemResponseDto.prototype, "unit_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Общая стоимость позиции',
        example: 37.00
    }),
    __metadata("design:type", Number)
], OrderItemResponseDto.prototype, "total_price", void 0);
//# sourceMappingURL=order-response.dto.js.map