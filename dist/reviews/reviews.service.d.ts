import { Repository } from 'typeorm';
import { RestaurantReview } from '../entities/restaurant-review.entity';
import { Restaurant } from '../entities/restaurant.entity';
import { User } from '../entities/user.entity';
import { CreateReviewDto, UpdateReviewDto, ReviewResponseDto, ReviewsPaginationResponseDto, ReviewFilterDto } from './dto/reviews.dto';
export declare class ReviewsService {
    private readonly reviewRepository;
    private readonly restaurantRepository;
    private readonly userRepository;
    constructor(reviewRepository: Repository<RestaurantReview>, restaurantRepository: Repository<Restaurant>, userRepository: Repository<User>);
    getReviews(filterDto: ReviewFilterDto): Promise<ReviewsPaginationResponseDto>;
    getReviewById(reviewId: string): Promise<ReviewResponseDto>;
    createReview(userId: string, createReviewDto: CreateReviewDto): Promise<ReviewResponseDto>;
    updateReview(userId: string, reviewId: string, updateReviewDto: UpdateReviewDto): Promise<ReviewResponseDto>;
    updateReviewByAdmin(id: string, updateReviewDto: UpdateReviewDto): Promise<ReviewResponseDto>;
    deleteReview(userId: string, reviewId: string): Promise<{
        message: string;
    }>;
    getUserReviews(userId: string, filters: ReviewFilterDto): Promise<ReviewsPaginationResponseDto>;
    getRestaurantReviewStats(restaurantId: number): Promise<{
        total_reviews: number;
        average_rating: number;
        rating_distribution: {
            rating: number;
            count: number;
        }[];
    }>;
    private mapToResponseDto;
    deleteUserRestaurantReview(userId: string, restaurantId: string): Promise<void>;
    deleteReviewByManager(id: string): Promise<void>;
    toggleUserRestaurantReview(userId: string, restaurantId: string, createReviewDto: CreateReviewDto): Promise<ReviewResponseDto | {
        message: string;
    }>;
}
