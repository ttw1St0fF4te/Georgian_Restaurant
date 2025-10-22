import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto, ReviewResponseDto, ReviewFilterDto } from './dto/reviews.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    createReview(userId: string, createReviewDto: CreateReviewDto): Promise<ReviewResponseDto>;
    getReviews(filterDto: ReviewFilterDto): Promise<any>;
    getRestaurantReviews(restaurantId: number, filterDto: ReviewFilterDto): Promise<any>;
    getRestaurantReviewStats(restaurantId: number): Promise<any>;
    getUserReviews(userId: string, filterDto: ReviewFilterDto): Promise<any>;
    getMyReviews(userId: string, filterDto: ReviewFilterDto): Promise<any>;
    getReview(id: string): Promise<ReviewResponseDto>;
    updateReview(userId: string, id: string, updateReviewDto: UpdateReviewDto): Promise<ReviewResponseDto>;
    deleteReview(user: any, id: string): Promise<{
        message: string;
    }>;
    deleteMyRestaurantReview(userId: string, restaurantId: number): Promise<{
        message: string;
    }>;
    toggleRestaurantReview(userId: string, restaurantId: number, createReviewDto: CreateReviewDto): Promise<ReviewResponseDto | {
        message: string;
    }>;
}
