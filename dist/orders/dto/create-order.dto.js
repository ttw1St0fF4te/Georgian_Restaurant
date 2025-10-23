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
exports.CreateOrderDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const order_entity_1 = require("../../entities/order.entity");
class CreateOrderDto {
    constructor() {
        this.should_update_user_address = false;
    }
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Тип заказа',
        enum: order_entity_1.OrderType,
        example: 'delivery'
    }),
    (0, class_validator_1.IsEnum)(order_entity_1.OrderType, { message: 'Тип заказа должен быть delivery или dine_in' }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "order_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Страна доставки (только для delivery)',
        example: 'Грузия',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Страна должна быть строкой' }),
    (0, class_validator_1.Length)(2, 50, { message: 'Страна должна быть от 2 до 50 символов' }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "delivery_country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Город доставки (только для delivery)',
        example: 'Тбилиси',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Город должен быть строкой' }),
    (0, class_validator_1.Length)(2, 100, { message: 'Город должен быть от 2 до 100 символов' }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "delivery_city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Адрес доставки (только для delivery)',
        example: 'ул. Руставели, 15, кв. 10',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Адрес должен быть строкой' }),
    (0, class_validator_1.Length)(5, 500, { message: 'Адрес должен быть от 5 до 500 символов' }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "delivery_street_address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Телефон для доставки (только для delivery)',
        example: '+995555123456',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Телефон должен быть строкой' }),
    (0, class_validator_1.Matches)(/^\+?[1-9]\d{1,14}$/, { message: 'Телефон должен быть в правильном формате' }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "delivery_phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID бронирования (только для dine_in)',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'ID бронирования должен быть корректным UUID' }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "reservation_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Обновить ли адрес пользователя указанным адресом доставки',
        example: false,
        required: false,
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Поле должно быть boolean' }),
    __metadata("design:type", Boolean)
], CreateOrderDto.prototype, "should_update_user_address", void 0);
//# sourceMappingURL=create-order.dto.js.map