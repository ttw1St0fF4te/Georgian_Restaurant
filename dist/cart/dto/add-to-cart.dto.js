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
exports.AddToCartDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class AddToCartDto {
}
exports.AddToCartDto = AddToCartDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID блюда из меню',
        example: 1,
        type: Number,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'ID блюда обязателен' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'ID блюда должен быть числом' }),
    (0, class_validator_1.Min)(1, { message: 'ID блюда должен быть положительным числом' }),
    __metadata("design:type", Number)
], AddToCartDto.prototype, "item_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Количество блюд для добавления в корзину (1-10)',
        example: 2,
        minimum: 1,
        maximum: 10,
        type: Number,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Количество обязательно' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'Количество должно быть целым числом' }),
    (0, class_validator_1.Min)(1, { message: 'Количество должно быть не менее 1' }),
    (0, class_validator_1.Max)(10, { message: 'Количество не должно превышать 10 штук за один раз' }),
    __metadata("design:type", Number)
], AddToCartDto.prototype, "quantity", void 0);
//# sourceMappingURL=add-to-cart.dto.js.map