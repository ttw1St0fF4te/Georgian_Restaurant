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
exports.MenuPaginationResponseDto = exports.UpdateMenuItemDto = exports.CreateMenuItemDto = exports.MenuFilterDto = exports.SortOrder = exports.MenuSortField = exports.MenuItemResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class MenuItemResponseDto {
}
exports.MenuItemResponseDto = MenuItemResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Уникальный идентификатор блюда',
        example: 1,
    }),
    __metadata("design:type", Number)
], MenuItemResponseDto.prototype, "item_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Название блюда',
        example: 'Хачапури по-аджарски',
        minLength: 3,
        maxLength: 150,
    }),
    __metadata("design:type", String)
], MenuItemResponseDto.prototype, "item_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Описание блюда',
        example: 'Традиционная грузинская лепешка с сыром и яйцом',
    }),
    __metadata("design:type", String)
], MenuItemResponseDto.prototype, "item_description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID категории меню',
        example: 1,
    }),
    __metadata("design:type", Number)
], MenuItemResponseDto.prototype, "category_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Стоимость блюда',
        example: 25.50,
    }),
    __metadata("design:type", Number)
], MenuItemResponseDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Время приготовления в минутах',
        example: 15,
    }),
    __metadata("design:type", Number)
], MenuItemResponseDto.prototype, "cooking_time_minutes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Калории',
        example: 350,
    }),
    __metadata("design:type", Number)
], MenuItemResponseDto.prototype, "calories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Вегетарианское блюдо',
        example: false,
    }),
    __metadata("design:type", Boolean)
], MenuItemResponseDto.prototype, "is_vegetarian", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Острое блюдо',
        example: false,
    }),
    __metadata("design:type", Boolean)
], MenuItemResponseDto.prototype, "is_spicy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Удалено (мягкое удаление)',
        example: false,
    }),
    __metadata("design:type", Boolean)
], MenuItemResponseDto.prototype, "is_deleted", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URL изображения блюда',
        example: 'https://example.com/image.jpg',
    }),
    __metadata("design:type", String)
], MenuItemResponseDto.prototype, "image_url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата создания',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], MenuItemResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата последнего обновления',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], MenuItemResponseDto.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Информация о категории',
    }),
    __metadata("design:type", Object)
], MenuItemResponseDto.prototype, "category", void 0);
var MenuSortField;
(function (MenuSortField) {
    MenuSortField["PRICE"] = "price";
    MenuSortField["COOKING_TIME"] = "cooking_time_minutes";
    MenuSortField["CALORIES"] = "calories";
    MenuSortField["NAME"] = "item_name";
    MenuSortField["CREATED_AT"] = "created_at";
})(MenuSortField || (exports.MenuSortField = MenuSortField = {}));
var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "ASC";
    SortOrder["DESC"] = "DESC";
})(SortOrder || (exports.SortOrder = SortOrder = {}));
class MenuFilterDto {
}
exports.MenuFilterDto = MenuFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Поиск по названию блюда',
        example: 'хачапури',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MenuFilterDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Фильтр по категории',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], MenuFilterDto.prototype, "category_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Фильтр только вегетарианских блюд',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], MenuFilterDto.prototype, "is_vegetarian", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Фильтр только острых блюд',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], MenuFilterDto.prototype, "is_spicy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Минимальная цена',
        example: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], MenuFilterDto.prototype, "min_price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Максимальная цена',
        example: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], MenuFilterDto.prototype, "max_price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Максимальное время приготовления',
        example: 30,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], MenuFilterDto.prototype, "max_cooking_time", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Максимальное количество калорий',
        example: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], MenuFilterDto.prototype, "max_calories", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Поле для сортировки',
        enum: MenuSortField,
        example: MenuSortField.PRICE,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(MenuSortField),
    __metadata("design:type", String)
], MenuFilterDto.prototype, "sort_by", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Порядок сортировки',
        enum: SortOrder,
        example: SortOrder.ASC,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(SortOrder),
    __metadata("design:type", String)
], MenuFilterDto.prototype, "sort_order", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Номер страницы (для пагинации)',
        example: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], MenuFilterDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Количество элементов на странице',
        example: 20,
        minimum: 1,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], MenuFilterDto.prototype, "limit", void 0);
class CreateMenuItemDto {
}
exports.CreateMenuItemDto = CreateMenuItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Название блюда',
        example: 'Хачапури по-аджарски',
        minLength: 3,
        maxLength: 150,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(3, 150),
    __metadata("design:type", String)
], CreateMenuItemDto.prototype, "item_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Описание блюда',
        example: 'Традиционная грузинская лепешка с сыром и яйцом',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuItemDto.prototype, "item_description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID категории меню',
        example: 1,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateMenuItemDto.prototype, "category_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Стоимость блюда',
        example: 25.50,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateMenuItemDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Время приготовления в минутах',
        example: 15,
        default: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateMenuItemDto.prototype, "cooking_time_minutes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Калории',
        example: 350,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateMenuItemDto.prototype, "calories", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Вегетарианское блюдо',
        example: false,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateMenuItemDto.prototype, "is_vegetarian", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Острое блюдо',
        example: false,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateMenuItemDto.prototype, "is_spicy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URL изображения блюда',
        example: 'https://example.com/image.jpg',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuItemDto.prototype, "image_url", void 0);
class UpdateMenuItemDto {
}
exports.UpdateMenuItemDto = UpdateMenuItemDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Название блюда',
        example: 'Хачапури по-аджарски',
        minLength: 3,
        maxLength: 150,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(3, 150),
    __metadata("design:type", String)
], UpdateMenuItemDto.prototype, "item_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Описание блюда',
        example: 'Традиционная грузинская лепешка с сыром и яйцом',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMenuItemDto.prototype, "item_description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID категории меню',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], UpdateMenuItemDto.prototype, "category_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Стоимость блюда',
        example: 25.50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], UpdateMenuItemDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Время приготовления в минутах',
        example: 15,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateMenuItemDto.prototype, "cooking_time_minutes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Калории',
        example: 350,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateMenuItemDto.prototype, "calories", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Вегетарианское блюдо',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateMenuItemDto.prototype, "is_vegetarian", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Острое блюдо',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateMenuItemDto.prototype, "is_spicy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URL изображения блюда',
        example: 'https://example.com/image.jpg',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMenuItemDto.prototype, "image_url", void 0);
class MenuPaginationResponseDto {
}
exports.MenuPaginationResponseDto = MenuPaginationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Список блюд',
        type: [MenuItemResponseDto],
    }),
    __metadata("design:type", Array)
], MenuPaginationResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Общее количество блюд',
        example: 45,
    }),
    __metadata("design:type", Number)
], MenuPaginationResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Текущая страница',
        example: 1,
    }),
    __metadata("design:type", Number)
], MenuPaginationResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Количество элементов на странице',
        example: 20,
    }),
    __metadata("design:type", Number)
], MenuPaginationResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Общее количество страниц',
        example: 3,
    }),
    __metadata("design:type", Number)
], MenuPaginationResponseDto.prototype, "pages", void 0);
//# sourceMappingURL=menu.dto.js.map