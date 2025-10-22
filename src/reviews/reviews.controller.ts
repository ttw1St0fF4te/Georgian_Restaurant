import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import {
  CreateReviewDto,
  UpdateReviewDto,
  ReviewResponseDto,
  ReviewFilterDto,
  PaginatedReviewsDto,
  ReviewStatsDto,
} from './dto/reviews.dto';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Roles('user', 'admin') // Только пользователи и админы могут создавать отзывы
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Review created successfully',
    type: ReviewResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Review already exists for this restaurant',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Restaurant not found',
  })
  async createReview(
    @GetUser('userId') userId: string,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    return this.reviewsService.createReview(userId, createReviewDto);
  }

  @Get()
  @Public() // Неавторизованные пользователи могут просматривать отзывы
  @ApiOperation({ summary: 'Get all reviews with filtering and pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reviews retrieved successfully',
    type: PaginatedReviewsDto,
  })
  async getReviews(
    @Query() filterDto: ReviewFilterDto,
  ): Promise<any> {
    return this.reviewsService.getReviews(filterDto);
  }

  @Get('restaurant/:restaurantId')
  @Public() // Неавторизованные пользователи могут просматривать отзывы ресторана
  @ApiOperation({ summary: 'Get reviews for a specific restaurant' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Restaurant reviews retrieved successfully',
    type: PaginatedReviewsDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Restaurant not found',
  })
  async getRestaurantReviews(
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
    @Query() filterDto: ReviewFilterDto,
  ): Promise<any> {
    const filterWithRestaurant = { ...filterDto, restaurantId };
    return this.reviewsService.getReviews(filterWithRestaurant);
  }

  @Get('restaurant/:restaurantId/stats')
  @Public() // Неавторизованные пользователи могут просматривать статистику отзывов
  @ApiOperation({ summary: 'Get review statistics for a restaurant' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Restaurant review statistics retrieved successfully',
    type: ReviewStatsDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Restaurant not found',
  })
  async getRestaurantReviewStats(
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
  ): Promise<any> {
    return this.reviewsService.getRestaurantReviewStats(restaurantId);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles('admin', 'manager') // Только админы и менеджеры могут просматривать отзывы конкретного пользователя
  @ApiOperation({ summary: 'Get reviews by a specific user (Admin/Manager only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User reviews retrieved successfully',
    type: PaginatedReviewsDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async getUserReviews(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() filterDto: ReviewFilterDto,
  ): Promise<any> {
    const filterWithUser = { ...filterDto, userId };
    return this.reviewsService.getReviews(filterWithUser);
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Roles('user', 'admin') // Только пользователи и админы могут просматривать свои отзывы
  @ApiOperation({ summary: 'Get current user reviews' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User reviews retrieved successfully',
    type: PaginatedReviewsDto,
  })
  async getMyReviews(
    @GetUser('userId') userId: string,
    @Query() filterDto: ReviewFilterDto,
  ): Promise<any> {
    const filterWithUser = { ...filterDto, userId };
    return this.reviewsService.getReviews(filterWithUser);
  }

  @Get(':id')
  @Public() // Неавторизованные пользователи могут просматривать отдельный отзыв
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Review retrieved successfully',
    type: ReviewResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Review not found',
  })
  async getReview(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ReviewResponseDto> {
    return this.reviewsService.getReviewById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Roles('admin') // Только админы могут обновлять отзывы
  @ApiOperation({ summary: 'Update a review (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Review updated successfully',
    type: ReviewResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied - Admin only',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Review not found',
  })
  async updateReview(
    @GetUser('userId') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    // Админы могут обновлять любые отзывы, не проверяем владение
    return this.reviewsService.updateReviewByAdmin(id, updateReviewDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Roles('user', 'manager', 'admin') // Пользователи могут удалять свои отзывы, менеджеры и админы - любые
  @ApiOperation({ summary: 'Delete a review' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Review deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied - not review owner',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Review not found',
  })
  async deleteReview(
    @GetUser() user: any, // Получаем полный объект пользователя
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    const userId = user.userId;
    const userRole = user.role;
    
    // Если пользователь - обычный user, проверяем что это его отзыв
    // Если manager или admin - можем удалить любой отзыв
    if (userRole === 'user') {
      await this.reviewsService.deleteReview(userId, id);
    } else {
      // Для менеджеров и админов - удаляем без проверки владения
      await this.reviewsService.deleteReviewByManager(id);
    }
    
    return { message: 'Review deleted successfully' };
  }

  @Delete('restaurant/:restaurantId/my')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Roles('user', 'admin') // Только пользователи и админы могут удалять свои отзывы для ресторана
  @ApiOperation({ summary: 'Delete current user review for a restaurant' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Review deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Review not found',
  })
  async deleteMyRestaurantReview(
    @GetUser('userId') userId: string,
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
  ): Promise<{ message: string }> {
    await this.reviewsService.deleteUserRestaurantReview(userId, restaurantId.toString());
    return { message: 'Review deleted successfully' };
  }

  @Post('restaurant/:restaurantId/toggle')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Roles('user', 'admin') // Только пользователи и админы могут создавать/удалять отзывы
  @ApiOperation({ summary: 'Toggle review for a restaurant (create or delete)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Review toggled successfully',
    type: ReviewResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Review created successfully',
    type: ReviewResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Restaurant not found',
  })
  async toggleRestaurantReview(
    @GetUser('userId') userId: string,
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ReviewResponseDto | { message: string }> {
    return this.reviewsService.toggleUserRestaurantReview(
      userId,
      restaurantId.toString(),
      createReviewDto,
    );
  }
}