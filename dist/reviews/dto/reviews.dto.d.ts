export declare class CreateReviewDto {
    restaurant_id: number;
    rating: number;
    review_text?: string;
}
export declare class UpdateReviewDto {
    rating?: number;
    review_text?: string;
}
export declare class ReviewResponseDto {
    review_id: string;
    user_id: string;
    restaurant_id: number;
    rating: number;
    review_text?: string;
    created_at: Date;
    updated_at: Date;
    user?: {
        user_id: string;
        username: string;
        first_name: string;
        last_name: string;
    };
}
export declare class ReviewsPaginationResponseDto {
    reviews: ReviewResponseDto[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}
export declare class ReviewFilterDto {
    restaurantId?: number;
    userId?: string;
    minRating?: number;
    maxRating?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
}
export declare class PaginatedReviewsDto {
    reviews: ReviewResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export declare class ReviewStatsDto {
    restaurantId: number;
    totalReviews: number;
    averageRating: number;
    ratingDistribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
    recentReviews: ReviewResponseDto[];
}
