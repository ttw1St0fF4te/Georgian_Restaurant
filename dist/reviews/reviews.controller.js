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
exports.ReviewsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reviews_service_1 = require("./reviews.service");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const reviews_dto_1 = require("./dto/reviews.dto");
let ReviewsController = class ReviewsController {
    constructor(reviewsService) {
        this.reviewsService = reviewsService;
    }
    async createReview(userId, createReviewDto) {
        return this.reviewsService.createReview(userId, createReviewDto);
    }
    async getReviews(filterDto) {
        return this.reviewsService.getReviews(filterDto);
    }
    async getRestaurantReviews(restaurantId, filterDto) {
        const filterWithRestaurant = { ...filterDto, restaurantId };
        return this.reviewsService.getReviews(filterWithRestaurant);
    }
    async getRestaurantReviewStats(restaurantId) {
        return this.reviewsService.getRestaurantReviewStats(restaurantId);
    }
    async getUserReviews(userId, filterDto) {
        const filterWithUser = { ...filterDto, userId };
        return this.reviewsService.getReviews(filterWithUser);
    }
    async getMyReviews(userId, filterDto) {
        const filterWithUser = { ...filterDto, userId };
        return this.reviewsService.getReviews(filterWithUser);
    }
    async getReview(id) {
        return this.reviewsService.getReviewById(id);
    }
    async updateReview(userId, id, updateReviewDto) {
        return this.reviewsService.updateReviewByAdmin(id, updateReviewDto);
    }
    async deleteReview(user, id) {
        const userId = user.userId;
        const userRole = user.role;
        if (userRole === 'user') {
            await this.reviewsService.deleteReview(userId, id);
        }
        else {
            await this.reviewsService.deleteReviewByManager(id);
        }
        return { message: 'Review deleted successfully' };
    }
    async deleteMyRestaurantReview(userId, restaurantId) {
        await this.reviewsService.deleteUserRestaurantReview(userId, restaurantId.toString());
        return { message: 'Review deleted successfully' };
    }
    async toggleRestaurantReview(userId, restaurantId, createReviewDto) {
        return this.reviewsService.toggleUserRestaurantReview(userId, restaurantId.toString(), createReviewDto);
    }
};
exports.ReviewsController = ReviewsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)('user', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new review' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Review created successfully',
        type: reviews_dto_1.ReviewResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Review already exists for this restaurant',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Restaurant not found',
    }),
    __param(0, (0, get_user_decorator_1.GetUser)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reviews_dto_1.CreateReviewDto]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "createReview", null);
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all reviews with filtering and pagination' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Reviews retrieved successfully',
        type: reviews_dto_1.PaginatedReviewsDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reviews_dto_1.ReviewFilterDto]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getReviews", null);
__decorate([
    (0, common_1.Get)('restaurant/:restaurantId'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get reviews for a specific restaurant' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Restaurant reviews retrieved successfully',
        type: reviews_dto_1.PaginatedReviewsDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Restaurant not found',
    }),
    __param(0, (0, common_1.Param)('restaurantId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, reviews_dto_1.ReviewFilterDto]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getRestaurantReviews", null);
__decorate([
    (0, common_1.Get)('restaurant/:restaurantId/stats'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get review statistics for a restaurant' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Restaurant review statistics retrieved successfully',
        type: reviews_dto_1.ReviewStatsDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Restaurant not found',
    }),
    __param(0, (0, common_1.Param)('restaurantId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getRestaurantReviewStats", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reviews by a specific user (Admin/Manager only)' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'User reviews retrieved successfully',
        type: reviews_dto_1.PaginatedReviewsDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Access denied',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'User not found',
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reviews_dto_1.ReviewFilterDto]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getUserReviews", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)('user', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user reviews' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'User reviews retrieved successfully',
        type: reviews_dto_1.PaginatedReviewsDto,
    }),
    __param(0, (0, get_user_decorator_1.GetUser)('userId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reviews_dto_1.ReviewFilterDto]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getMyReviews", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get review by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Review retrieved successfully',
        type: reviews_dto_1.ReviewResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Review not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getReview", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a review (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Review updated successfully',
        type: reviews_dto_1.ReviewResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Access denied - Admin only',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Review not found',
    }),
    __param(0, (0, get_user_decorator_1.GetUser)('userId')),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, reviews_dto_1.UpdateReviewDto]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "updateReview", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)('user', 'manager', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a review' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Review deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Access denied - not review owner',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Review not found',
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "deleteReview", null);
__decorate([
    (0, common_1.Delete)('restaurant/:restaurantId/my'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)('user', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete current user review for a restaurant' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Review deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Review not found',
    }),
    __param(0, (0, get_user_decorator_1.GetUser)('userId')),
    __param(1, (0, common_1.Param)('restaurantId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "deleteMyRestaurantReview", null);
__decorate([
    (0, common_1.Post)('restaurant/:restaurantId/toggle'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)('user', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle review for a restaurant (create or delete)' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Review toggled successfully',
        type: reviews_dto_1.ReviewResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Review created successfully',
        type: reviews_dto_1.ReviewResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Restaurant not found',
    }),
    __param(0, (0, get_user_decorator_1.GetUser)('userId')),
    __param(1, (0, common_1.Param)('restaurantId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, reviews_dto_1.CreateReviewDto]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "toggleRestaurantReview", null);
exports.ReviewsController = ReviewsController = __decorate([
    (0, swagger_1.ApiTags)('reviews'),
    (0, common_1.Controller)('reviews'),
    __metadata("design:paramtypes", [reviews_service_1.ReviewsService])
], ReviewsController);
//# sourceMappingURL=reviews.controller.js.map