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
exports.ReviewStatsDto = exports.PaginatedReviewsDto = exports.ReviewFilterDto = exports.ReviewsPaginationResponseDto = exports.ReviewResponseDto = exports.UpdateReviewDto = exports.CreateReviewDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateReviewDto {
}
exports.CreateReviewDto = CreateReviewDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID ресторана',
        example: 1,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateReviewDto.prototype, "restaurant_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Рейтинг от 1 до 5',
        example: 5,
        minimum: 1,
        maximum: 5,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateReviewDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Текст отзыва (минимум 10 символов)',
        example: 'Отличный ресторан с прекрасной кухней и обслуживанием!',
        minLength: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10, { message: 'Текст отзыва должен содержать минимум 10 символов' }),
    __metadata("design:type", String)
], CreateReviewDto.prototype, "review_text", void 0);
class UpdateReviewDto {
}
exports.UpdateReviewDto = UpdateReviewDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Рейтинг от 1 до 5',
        example: 4,
        minimum: 1,
        maximum: 5,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], UpdateReviewDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Текст отзыва (минимум 10 символов)',
        example: 'Обновленный отзыв о ресторане',
        minLength: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10, { message: 'Текст отзыва должен содержать минимум 10 символов' }),
    __metadata("design:type", String)
], UpdateReviewDto.prototype, "review_text", void 0);
class ReviewResponseDto {
}
exports.ReviewResponseDto = ReviewResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID отзыва',
        example: 'd5669069-0e13-4c97-a07d-381c12f37142',
    }),
    __metadata("design:type", String)
], ReviewResponseDto.prototype, "review_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID пользователя',
        example: 'd5669069-0e13-4c97-a07d-381c12f37142',
    }),
    __metadata("design:type", String)
], ReviewResponseDto.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID ресторана',
        example: 1,
    }),
    __metadata("design:type", Number)
], ReviewResponseDto.prototype, "restaurant_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Рейтинг от 1 до 5',
        example: 5,
    }),
    __metadata("design:type", Number)
], ReviewResponseDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Текст отзыва',
        example: 'Отличный ресторан с прекрасной кухней и обслуживанием!',
    }),
    __metadata("design:type", String)
], ReviewResponseDto.prototype, "review_text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата создания',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], ReviewResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата обновления',
        example: '2024-01-15T15:45:00Z',
    }),
    __metadata("design:type", Date)
], ReviewResponseDto.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Информация о пользователе',
        type: 'object',
        properties: {
            user_id: { type: 'string', example: 'd5669069-0e13-4c97-a07d-381c12f37142' },
            username: { type: 'string', example: 'john_doe' },
            first_name: { type: 'string', example: 'John' },
            last_name: { type: 'string', example: 'Doe' },
        },
    }),
    __metadata("design:type", Object)
], ReviewResponseDto.prototype, "user", void 0);
class ReviewsPaginationResponseDto {
}
exports.ReviewsPaginationResponseDto = ReviewsPaginationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Список отзывов',
        type: [ReviewResponseDto],
    }),
    __metadata("design:type", Array)
], ReviewsPaginationResponseDto.prototype, "reviews", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Общее количество отзывов',
        example: 25,
    }),
    __metadata("design:type", Number)
], ReviewsPaginationResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Текущая страница',
        example: 1,
    }),
    __metadata("design:type", Number)
], ReviewsPaginationResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Количество элементов на странице',
        example: 10,
    }),
    __metadata("design:type", Number)
], ReviewsPaginationResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Общее количество страниц',
        example: 3,
    }),
    __metadata("design:type", Number)
], ReviewsPaginationResponseDto.prototype, "pages", void 0);
class ReviewFilterDto {
}
exports.ReviewFilterDto = ReviewFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by restaurant ID',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ReviewFilterDto.prototype, "restaurantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by user ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4),
    __metadata("design:type", String)
], ReviewFilterDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by minimum rating',
        minimum: 1,
        maximum: 5,
        example: 3,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], ReviewFilterDto.prototype, "minRating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by maximum rating',
        minimum: 1,
        maximum: 5,
        example: 5,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], ReviewFilterDto.prototype, "maxRating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort by field',
        enum: ['created_at', 'rating', 'updated_at'],
        example: 'created_at',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['created_at', 'rating', 'updated_at']),
    __metadata("design:type", String)
], ReviewFilterDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order',
        enum: ['ASC', 'DESC'],
        example: 'DESC',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['ASC', 'DESC']),
    __metadata("design:type", String)
], ReviewFilterDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number (1-based)',
        minimum: 1,
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    __metadata("design:type", Number)
], ReviewFilterDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of items per page',
        minimum: 1,
        maximum: 100,
        example: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    __metadata("design:type", Number)
], ReviewFilterDto.prototype, "limit", void 0);
class PaginatedReviewsDto {
}
exports.PaginatedReviewsDto = PaginatedReviewsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of reviews',
        type: [ReviewResponseDto],
    }),
    __metadata("design:type", Array)
], PaginatedReviewsDto.prototype, "reviews", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of reviews',
        example: 150,
    }),
    __metadata("design:type", Number)
], PaginatedReviewsDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current page number',
        example: 1,
    }),
    __metadata("design:type", Number)
], PaginatedReviewsDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items per page',
        example: 10,
    }),
    __metadata("design:type", Number)
], PaginatedReviewsDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of pages',
        example: 15,
    }),
    __metadata("design:type", Number)
], PaginatedReviewsDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether there is a next page',
        example: true,
    }),
    __metadata("design:type", Boolean)
], PaginatedReviewsDto.prototype, "hasNext", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether there is a previous page',
        example: false,
    }),
    __metadata("design:type", Boolean)
], PaginatedReviewsDto.prototype, "hasPrev", void 0);
class ReviewStatsDto {
}
exports.ReviewStatsDto = ReviewStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Restaurant ID',
        example: 1,
    }),
    __metadata("design:type", Number)
], ReviewStatsDto.prototype, "restaurantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of reviews',
        example: 125,
    }),
    __metadata("design:type", Number)
], ReviewStatsDto.prototype, "totalReviews", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Average rating',
        example: 4.3,
    }),
    __metadata("design:type", Number)
], ReviewStatsDto.prototype, "averageRating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Rating distribution',
        example: {
            1: 5,
            2: 10,
            3: 20,
            4: 45,
            5: 45,
        },
    }),
    __metadata("design:type", Object)
], ReviewStatsDto.prototype, "ratingDistribution", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Most recent reviews',
        type: [ReviewResponseDto],
    }),
    __metadata("design:type", Array)
], ReviewStatsDto.prototype, "recentReviews", void 0);
//# sourceMappingURL=reviews.dto.js.map