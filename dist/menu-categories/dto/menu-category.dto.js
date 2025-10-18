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
exports.UpdateMenuCategoryDto = exports.CreateMenuCategoryDto = exports.MenuCategoryResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class MenuCategoryResponseDto {
}
exports.MenuCategoryResponseDto = MenuCategoryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Уникальный идентификатор категории',
        example: 1,
    }),
    __metadata("design:type", Number)
], MenuCategoryResponseDto.prototype, "category_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Название категории меню',
        example: 'Горячие блюда',
        minLength: 2,
        maxLength: 100,
    }),
    __metadata("design:type", String)
], MenuCategoryResponseDto.prototype, "category_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Описание категории',
        example: 'Основные блюда грузинской кухни',
    }),
    __metadata("design:type", String)
], MenuCategoryResponseDto.prototype, "category_description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата создания категории',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], MenuCategoryResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата последнего обновления',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], MenuCategoryResponseDto.prototype, "updated_at", void 0);
class CreateMenuCategoryDto {
}
exports.CreateMenuCategoryDto = CreateMenuCategoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Название категории меню',
        example: 'Горячие блюда',
        minLength: 2,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(2, 100),
    __metadata("design:type", String)
], CreateMenuCategoryDto.prototype, "category_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Описание категории',
        example: 'Основные блюда грузинской кухни',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuCategoryDto.prototype, "category_description", void 0);
class UpdateMenuCategoryDto {
}
exports.UpdateMenuCategoryDto = UpdateMenuCategoryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Название категории меню',
        example: 'Горячие блюда',
        minLength: 2,
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(2, 100),
    __metadata("design:type", String)
], UpdateMenuCategoryDto.prototype, "category_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Описание категории',
        example: 'Основные блюда грузинской кухни',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMenuCategoryDto.prototype, "category_description", void 0);
//# sourceMappingURL=menu-category.dto.js.map