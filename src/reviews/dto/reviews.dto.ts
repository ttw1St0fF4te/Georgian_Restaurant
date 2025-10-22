import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min, MinLength, IsNotEmpty, IsIn, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

// Create DTO
export class CreateReviewDto {
  @ApiProperty({
    description: 'ID ресторана',
    example: 1,
  })
  @IsInt()
  @Min(1)
  restaurant_id: number;

  @ApiProperty({
    description: 'Рейтинг от 1 до 5',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({
    description: 'Текст отзыва (минимум 10 символов)',
    example: 'Отличный ресторан с прекрасной кухней и обслуживанием!',
    minLength: 10,
  })
  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'Текст отзыва должен содержать минимум 10 символов' })
  review_text?: string;
}

// Update DTO
export class UpdateReviewDto {
  @ApiPropertyOptional({
    description: 'Рейтинг от 1 до 5',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({
    description: 'Текст отзыва (минимум 10 символов)',
    example: 'Обновленный отзыв о ресторане',
    minLength: 10,
  })
  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'Текст отзыва должен содержать минимум 10 символов' })
  review_text?: string;
}

// Response DTO
export class ReviewResponseDto {
  @ApiProperty({
    description: 'ID отзыва',
    example: 'd5669069-0e13-4c97-a07d-381c12f37142',
  })
  review_id: string;

  @ApiProperty({
    description: 'ID пользователя',
    example: 'd5669069-0e13-4c97-a07d-381c12f37142',
  })
  user_id: string;

  @ApiProperty({
    description: 'ID ресторана',
    example: 1,
  })
  restaurant_id: number;

  @ApiProperty({
    description: 'Рейтинг от 1 до 5',
    example: 5,
  })
  rating: number;

  @ApiPropertyOptional({
    description: 'Текст отзыва',
    example: 'Отличный ресторан с прекрасной кухней и обслуживанием!',
  })
  review_text?: string;

  @ApiProperty({
    description: 'Дата создания',
    example: '2024-01-15T10:30:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Дата обновления',
    example: '2024-01-15T15:45:00Z',
  })
  updated_at: Date;

  // User information
  @ApiPropertyOptional({
    description: 'Информация о пользователе',
    type: 'object',
    properties: {
      user_id: { type: 'string', example: 'd5669069-0e13-4c97-a07d-381c12f37142' },
      username: { type: 'string', example: 'john_doe' },
      first_name: { type: 'string', example: 'John' },
      last_name: { type: 'string', example: 'Doe' },
    },
  })
  user?: {
    user_id: string;
    username: string;
    first_name: string;
    last_name: string;
  };
}

// Pagination Response DTO
export class ReviewsPaginationResponseDto {
  @ApiProperty({
    description: 'Список отзывов',
    type: [ReviewResponseDto],
  })
  reviews: ReviewResponseDto[];

  @ApiProperty({
    description: 'Общее количество отзывов',
    example: 25,
  })
  total: number;

  @ApiProperty({
    description: 'Текущая страница',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Количество элементов на странице',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Общее количество страниц',
    example: 3,
  })
  pages: number;
}

// Filter DTO for queries
export class ReviewFilterDto {
  @ApiPropertyOptional({
    description: 'Filter by restaurant ID',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  restaurantId?: number;

  @ApiPropertyOptional({
    description: 'Filter by user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID(4)
  userId?: string;

  @ApiPropertyOptional({
    description: 'Filter by minimum rating',
    minimum: 1,
    maximum: 5,
    example: 3,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  minRating?: number;

  @ApiPropertyOptional({
    description: 'Filter by maximum rating',
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  maxRating?: number;

  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: ['created_at', 'rating', 'updated_at'],
    example: 'created_at',
  })
  @IsOptional()
  @IsIn(['created_at', 'rating', 'updated_at'])
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['ASC', 'DESC'],
    example: 'DESC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';

  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    minimum: 1,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value))
  limit?: number;
}

export class PaginatedReviewsDto {
  @ApiProperty({
    description: 'List of reviews',
    type: [ReviewResponseDto],
  })
  reviews: ReviewResponseDto[];

  @ApiProperty({
    description: 'Total number of reviews',
    example: 150,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 15,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Whether there is a next page',
    example: true,
  })
  hasNext: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
  })
  hasPrev: boolean;
}

export class ReviewStatsDto {
  @ApiProperty({
    description: 'Restaurant ID',
    example: 1,
  })
  restaurantId: number;

  @ApiProperty({
    description: 'Total number of reviews',
    example: 125,
  })
  totalReviews: number;

  @ApiProperty({
    description: 'Average rating',
    example: 4.3,
  })
  averageRating: number;

  @ApiProperty({
    description: 'Rating distribution',
    example: {
      1: 5,
      2: 10,
      3: 20,
      4: 45,
      5: 45,
    },
  })
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };

  @ApiProperty({
    description: 'Most recent reviews',
    type: [ReviewResponseDto],
  })
  recentReviews: ReviewResponseDto[];
}