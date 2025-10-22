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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const restaurant_review_entity_1 = require("../entities/restaurant-review.entity");
const restaurant_entity_1 = require("../entities/restaurant.entity");
const user_entity_1 = require("../entities/user.entity");
let ReviewsService = class ReviewsService {
    constructor(reviewRepository, restaurantRepository, userRepository) {
        this.reviewRepository = reviewRepository;
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
    }
    async getReviews(filterDto) {
        const { userId, restaurantId, minRating, maxRating, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC', } = filterDto;
        const queryBuilder = this.reviewRepository
            .createQueryBuilder('review')
            .leftJoinAndSelect('review.user', 'user')
            .leftJoinAndSelect('review.restaurant', 'restaurant')
            .select([
            'review.review_id',
            'review.user_id',
            'review.restaurant_id',
            'review.rating',
            'review.review_text',
            'review.created_at',
            'review.updated_at',
            'user.user_id',
            'user.username',
            'user.first_name',
            'user.last_name',
            'restaurant.restaurant_id',
            'restaurant.restaurant_name',
        ]);
        if (restaurantId) {
            queryBuilder.andWhere('review.restaurant_id = :restaurantId', { restaurantId });
        }
        if (minRating) {
            queryBuilder.andWhere('review.rating >= :minRating', { minRating });
        }
        if (maxRating) {
            queryBuilder.andWhere('review.rating <= :maxRating', { maxRating });
        }
        queryBuilder.orderBy(`review.${sortBy}`, sortOrder);
        const offset = (page - 1) * limit;
        queryBuilder.skip(offset).take(limit);
        const [reviews, total] = await queryBuilder.getManyAndCount();
        return {
            reviews: reviews.map(this.mapToResponseDto),
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        };
    }
    async getReviewById(reviewId) {
        const review = await this.reviewRepository.findOne({
            where: { review_id: reviewId },
            relations: ['user', 'restaurant'],
            select: {
                review_id: true,
                user_id: true,
                restaurant_id: true,
                rating: true,
                review_text: true,
                created_at: true,
                updated_at: true,
                user: {
                    user_id: true,
                    username: true,
                    first_name: true,
                    last_name: true,
                },
                restaurant: {
                    restaurant_id: true,
                    restaurant_name: true,
                },
            },
        });
        if (!review) {
            throw new common_1.NotFoundException(`Отзыв с ID ${reviewId} не найден`);
        }
        return this.mapToResponseDto(review);
    }
    async createReview(userId, createReviewDto) {
        const { restaurant_id, rating, review_text } = createReviewDto;
        const restaurant = await this.restaurantRepository.findOne({
            where: { restaurant_id },
        });
        if (!restaurant) {
            throw new common_1.NotFoundException(`Ресторан с ID ${restaurant_id} не найден`);
        }
        const existingReview = await this.reviewRepository.findOne({
            where: {
                user_id: userId,
                restaurant_id,
            },
        });
        if (existingReview) {
            throw new common_1.ConflictException('Вы уже оставили отзыв для этого ресторана');
        }
        const review = this.reviewRepository.create({
            user_id: userId,
            restaurant_id,
            rating,
            review_text,
        });
        const savedReview = await this.reviewRepository.save(review);
        return this.getReviewById(savedReview.review_id);
    }
    async updateReview(userId, reviewId, updateReviewDto) {
        const review = await this.reviewRepository.findOne({
            where: { review_id: reviewId },
        });
        if (!review) {
            throw new common_1.NotFoundException(`Отзыв с ID ${reviewId} не найден`);
        }
        if (review.user_id !== userId) {
            throw new common_1.ForbiddenException('Вы можете редактировать только свои отзывы');
        }
        if (updateReviewDto.rating !== undefined) {
            review.rating = updateReviewDto.rating;
        }
        if (updateReviewDto.review_text !== undefined) {
            review.review_text = updateReviewDto.review_text;
        }
        await this.reviewRepository.save(review);
        return this.getReviewById(reviewId);
    }
    async updateReviewByAdmin(id, updateReviewDto) {
        const review = await this.reviewRepository.findOne({
            where: { review_id: id },
            relations: ['user', 'restaurant'],
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        if (updateReviewDto.rating !== undefined) {
            review.rating = updateReviewDto.rating;
        }
        if (updateReviewDto.review_text !== undefined) {
            review.review_text = updateReviewDto.review_text;
        }
        const updatedReview = await this.reviewRepository.save(review);
        return this.mapToResponseDto(updatedReview);
    }
    async deleteReview(userId, reviewId) {
        const review = await this.reviewRepository.findOne({
            where: { review_id: reviewId },
        });
        if (!review) {
            throw new common_1.NotFoundException(`Отзыв с ID ${reviewId} не найден`);
        }
        if (review.user_id !== userId) {
            throw new common_1.ForbiddenException('Вы можете удалять только свои отзывы');
        }
        await this.reviewRepository.remove(review);
        return { message: 'Отзыв успешно удален' };
    }
    async getUserReviews(userId, filters) {
        return this.getReviews({ ...filters, user_id: userId });
    }
    async getRestaurantReviewStats(restaurantId) {
        const reviews = await this.reviewRepository.find({
            where: { restaurant_id: restaurantId },
        });
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews) * 100) / 100
            : 0;
        const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
            rating,
            count: reviews.filter(review => review.rating === rating).length,
        }));
        return {
            total_reviews: totalReviews,
            average_rating: averageRating,
            rating_distribution: ratingDistribution,
        };
    }
    mapToResponseDto(review) {
        return {
            review_id: review.review_id,
            user_id: review.user_id,
            restaurant_id: review.restaurant_id,
            rating: review.rating,
            review_text: review.review_text,
            created_at: review.created_at,
            updated_at: review.updated_at,
            user: review.user ? {
                user_id: review.user.user_id,
                username: review.user.username,
                first_name: review.user.first_name,
                last_name: review.user.last_name,
            } : undefined,
        };
    }
    async deleteUserRestaurantReview(userId, restaurantId) {
        const review = await this.reviewRepository.findOne({
            where: {
                user: { user_id: userId },
                restaurant: { restaurant_id: restaurantId },
            },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        await this.reviewRepository.remove(review);
    }
    async deleteReviewByManager(id) {
        const review = await this.reviewRepository.findOne({
            where: { review_id: id },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        await this.reviewRepository.remove(review);
    }
    async toggleUserRestaurantReview(userId, restaurantId, createReviewDto) {
        const existingReview = await this.reviewRepository.findOne({
            where: {
                user: { user_id: userId },
                restaurant: { restaurant_id: createReviewDto.restaurant_id },
            },
            relations: ['user', 'restaurant'],
        });
        if (existingReview) {
            await this.reviewRepository.remove(existingReview);
            return { message: 'Review deleted successfully' };
        }
        else {
            return this.createReview(userId, createReviewDto);
        }
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(restaurant_review_entity_1.RestaurantReview)),
    __param(1, (0, typeorm_1.InjectRepository)(restaurant_entity_1.Restaurant)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map