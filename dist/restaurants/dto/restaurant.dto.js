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
exports.RestaurantFilterDto = exports.UpdateRestaurantDto = exports.CreateRestaurantDto = exports.RestaurantDetailResponseDto = exports.RestaurantResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class RestaurantResponseDto {
}
exports.RestaurantResponseDto = RestaurantResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Уникальный идентификатор ресторана',
        example: 1,
    }),
    __metadata("design:type", Number)
], RestaurantResponseDto.prototype, "restaurant_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Название ресторана',
        example: 'Ресторан "Тбилиси"',
        minLength: 3,
        maxLength: 100,
    }),
    __metadata("design:type", String)
], RestaurantResponseDto.prototype, "restaurant_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Описание ресторана',
        example: 'Аутентичная грузинская кухня в самом сердце города',
    }),
    __metadata("design:type", String)
], RestaurantResponseDto.prototype, "restaurant_description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Страна',
        example: 'Грузия',
        default: 'Грузия',
    }),
    __metadata("design:type", String)
], RestaurantResponseDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Город',
        example: 'Тбилиси',
        default: 'Тбилиси',
    }),
    __metadata("design:type", String)
], RestaurantResponseDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Адрес ресторана',
        example: 'ул. Руставели, 15',
    }),
    __metadata("design:type", String)
], RestaurantResponseDto.prototype, "street_address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Часы работы по дням недели',
        example: {
            monday: '10:00-22:00',
            tuesday: '10:00-22:00',
            wednesday: '10:00-22:00',
            thursday: '10:00-22:00',
            friday: '10:00-23:00',
            saturday: '10:00-23:00',
            sunday: '12:00-21:00'
        },
    }),
    __metadata("design:type", Object)
], RestaurantResponseDto.prototype, "working_hours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Активен ли ресторан',
        example: true,
        default: true,
    }),
    __metadata("design:type", Boolean)
], RestaurantResponseDto.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Рейтинг ресторана',
        example: 4.5,
        minimum: 0,
        maximum: 5,
    }),
    __metadata("design:type", Number)
], RestaurantResponseDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата создания',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], RestaurantResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата последнего обновления',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], RestaurantResponseDto.prototype, "updated_at", void 0);
class RestaurantDetailResponseDto extends RestaurantResponseDto {
}
exports.RestaurantDetailResponseDto = RestaurantDetailResponseDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Статистика ресторана',
    }),
    __metadata("design:type", Object)
], RestaurantDetailResponseDto.prototype, "stats", void 0);
class CreateRestaurantDto {
}
exports.CreateRestaurantDto = CreateRestaurantDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Название ресторана',
        example: 'Ресторан "Тбилиси"',
        minLength: 3,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(3, 100),
    __metadata("design:type", String)
], CreateRestaurantDto.prototype, "restaurant_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Описание ресторана',
        example: 'Аутентичная грузинская кухня в самом сердце города',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRestaurantDto.prototype, "restaurant_description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Страна',
        example: 'Грузия',
        default: 'Грузия',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRestaurantDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Город',
        example: 'Тбилиси',
        default: 'Тбилиси',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRestaurantDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Адрес ресторана',
        example: 'ул. Руставели, 15',
        minLength: 5,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(5),
    __metadata("design:type", String)
], CreateRestaurantDto.prototype, "street_address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Часы работы по дням недели',
        example: {
            monday: '10:00-22:00',
            tuesday: '10:00-22:00',
            wednesday: '10:00-22:00',
            thursday: '10:00-22:00',
            friday: '10:00-23:00',
            saturday: '10:00-23:00',
            sunday: '12:00-21:00'
        },
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateRestaurantDto.prototype, "working_hours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Активен ли ресторан',
        example: true,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRestaurantDto.prototype, "is_active", void 0);
class UpdateRestaurantDto {
}
exports.UpdateRestaurantDto = UpdateRestaurantDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Название ресторана',
        example: 'Ресторан "Тбилиси"',
        minLength: 3,
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(3, 100),
    __metadata("design:type", String)
], UpdateRestaurantDto.prototype, "restaurant_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Описание ресторана',
        example: 'Аутентичная грузинская кухня в самом сердце города',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRestaurantDto.prototype, "restaurant_description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Страна',
        example: 'Грузия',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRestaurantDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Город',
        example: 'Тбилиси',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRestaurantDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Адрес ресторана',
        example: 'ул. Руставели, 15',
        minLength: 5,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(5),
    __metadata("design:type", String)
], UpdateRestaurantDto.prototype, "street_address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Часы работы по дням недели',
        example: {
            monday: '10:00-22:00',
            tuesday: '10:00-22:00',
            wednesday: '10:00-22:00',
            thursday: '10:00-22:00',
            friday: '10:00-23:00',
            saturday: '10:00-23:00',
            sunday: '12:00-21:00'
        },
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateRestaurantDto.prototype, "working_hours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Активен ли ресторан',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateRestaurantDto.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Рейтинг ресторана (только для админов)',
        example: 4.5,
        minimum: 0,
        maximum: 5,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], UpdateRestaurantDto.prototype, "rating", void 0);
class RestaurantFilterDto {
}
exports.RestaurantFilterDto = RestaurantFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Поиск по названию ресторана',
        example: 'тбилиси',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RestaurantFilterDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Фильтр по городу',
        example: 'Тбилиси',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RestaurantFilterDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Фильтр по стране',
        example: 'Грузия',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RestaurantFilterDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Показывать только активные рестораны',
        example: true,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], RestaurantFilterDto.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Минимальный рейтинг',
        example: 4.0,
        minimum: 0,
        maximum: 5,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], RestaurantFilterDto.prototype, "min_rating", void 0);
//# sourceMappingURL=restaurant.dto.js.map