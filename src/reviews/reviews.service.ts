import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantReview } from '../entities/restaurant-review.entity';
import { Restaurant } from '../entities/restaurant.entity';
import { User } from '../entities/user.entity';
import {
  CreateReviewDto,
  UpdateReviewDto,
  ReviewResponseDto,
  ReviewsPaginationResponseDto,
  ReviewFilterDto,
} from './dto/reviews.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(RestaurantReview)
    private readonly reviewRepository: Repository<RestaurantReview>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Получить отзывы с фильтрацией и пагинацией
   */
  async getReviews(filterDto: ReviewFilterDto): Promise<ReviewsPaginationResponseDto> {
    const {
      userId,
      restaurantId,
      minRating,
      maxRating,
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = filterDto;

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

        // Фильтрация по ресторану
    if (restaurantId) {
      queryBuilder.andWhere('review.restaurant_id = :restaurantId', { restaurantId });
    }

    // Фильтрация по минимальному рейтингу
    if (minRating) {
      queryBuilder.andWhere('review.rating >= :minRating', { minRating });
    }

    // Фильтрация по максимальному рейтингу
    if (maxRating) {
      queryBuilder.andWhere('review.rating <= :maxRating', { maxRating });
    }

    // Сортировка
    queryBuilder.orderBy(`review.${sortBy}`, sortOrder);

    // Применяем пагинацию
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

  /**
   * Получить отзыв по ID
   */
  async getReviewById(reviewId: string): Promise<ReviewResponseDto> {
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
      throw new NotFoundException(`Отзыв с ID ${reviewId} не найден`);
    }

    return this.mapToResponseDto(review);
  }

  /**
   * Создать новый отзыв
   */
  async createReview(userId: string, createReviewDto: CreateReviewDto): Promise<ReviewResponseDto> {
    const { restaurant_id, rating, review_text } = createReviewDto;

    // Проверяем существование ресторана
    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurant_id },
    });

    if (!restaurant) {
      throw new NotFoundException(`Ресторан с ID ${restaurant_id} не найден`);
    }

    // Проверяем, не оставлял ли пользователь уже отзыв для этого ресторана
    const existingReview = await this.reviewRepository.findOne({
      where: {
        user_id: userId,
        restaurant_id,
      },
    });

    if (existingReview) {
      throw new ConflictException('Вы уже оставили отзыв для этого ресторана');
    }

    // Создаем новый отзыв
    const review = this.reviewRepository.create({
      user_id: userId,
      restaurant_id,
      rating,
      review_text,
    });

    const savedReview = await this.reviewRepository.save(review);

    // Возвращаем отзыв с полной информацией
    return this.getReviewById(savedReview.review_id);
  }

  /**
   * Обновить отзыв
   */
  async updateReview(
    userId: string,
    reviewId: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    const review = await this.reviewRepository.findOne({
      where: { review_id: reviewId },
    });

    if (!review) {
      throw new NotFoundException(`Отзыв с ID ${reviewId} не найден`);
    }

    // Проверяем, что пользователь является автором отзыва
    if (review.user_id !== userId) {
      throw new ForbiddenException('Вы можете редактировать только свои отзывы');
    }

    // Обновляем поля
    if (updateReviewDto.rating !== undefined) {
      review.rating = updateReviewDto.rating;
    }

    if (updateReviewDto.review_text !== undefined) {
      review.review_text = updateReviewDto.review_text;
    }

    await this.reviewRepository.save(review);

    return this.getReviewById(reviewId);
  }

  async updateReviewByAdmin(
    id: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    const review = await this.reviewRepository.findOne({
      where: { review_id: id },
      relations: ['user', 'restaurant'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Админы могут обновлять любые отзывы без проверки владения
    if (updateReviewDto.rating !== undefined) {
      review.rating = updateReviewDto.rating;
    }

    if (updateReviewDto.review_text !== undefined) {
      review.review_text = updateReviewDto.review_text;
    }

    const updatedReview = await this.reviewRepository.save(review);
    return this.mapToResponseDto(updatedReview);
  }

  /**
   * Удалить отзыв
   */
  async deleteReview(userId: string, reviewId: string): Promise<{ message: string }> {
    const review = await this.reviewRepository.findOne({
      where: { review_id: reviewId },
    });

    if (!review) {
      throw new NotFoundException(`Отзыв с ID ${reviewId} не найден`);
    }

    // Проверяем, что пользователь является автором отзыва
    if (review.user_id !== userId) {
      throw new ForbiddenException('Вы можете удалять только свои отзывы');
    }

    await this.reviewRepository.remove(review);

    return { message: 'Отзыв успешно удален' };
  }

  /**
   * Получить отзывы пользователя
   */
  async getUserReviews(userId: string, filters: ReviewFilterDto): Promise<ReviewsPaginationResponseDto> {
    return this.getReviews({ ...filters, user_id: userId } as any);
  }

  /**
   * Получить статистику отзывов ресторана
   */
  async getRestaurantReviewStats(restaurantId: number): Promise<{
    total_reviews: number;
    average_rating: number;
    rating_distribution: { rating: number; count: number }[];
  }> {
    const reviews = await this.reviewRepository.find({
      where: { restaurant_id: restaurantId },
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews) * 100) / 100
      : 0;

    // Подсчитываем распределение по рейтингам
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

  /**
   * Маппинг в DTO для ответа
   */
  private mapToResponseDto(review: RestaurantReview): ReviewResponseDto {
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

  async deleteUserRestaurantReview(
    userId: string,
    restaurantId: string,
  ): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: {
        user: { user_id: userId },
        restaurant: { restaurant_id: restaurantId },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    await this.reviewRepository.remove(review);
  }

  async deleteReviewByManager(id: string): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { review_id: id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    await this.reviewRepository.remove(review);
  }

  async toggleUserRestaurantReview(
    userId: string,
    restaurantId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<ReviewResponseDto | { message: string }> {
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
    } else {
      return this.createReview(userId, createReviewDto);
    }
  }
}