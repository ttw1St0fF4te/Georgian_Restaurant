import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Restaurant } from '../entities/restaurant.entity';
import { 
  CreateRestaurantDto, 
  UpdateRestaurantDto, 
  RestaurantFilterDto,
  RestaurantDetailResponseDto 
} from './dto/restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async findAll(filterDto: RestaurantFilterDto = {}): Promise<Restaurant[]> {
    const {
      search,
      city,
      country,
      is_active = true, // По умолчанию показываем только активные
      min_rating,
    } = filterDto;

    const queryBuilder = this.restaurantRepository.createQueryBuilder('restaurant');

    // Применяем фильтры
    this.applyFilters(queryBuilder, filterDto);

    // Сортировка по рейтингу (лучшие сначала)
    queryBuilder.orderBy('restaurant.rating', 'DESC');
    queryBuilder.addOrderBy('restaurant.restaurant_name', 'ASC');

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<RestaurantDetailResponseDto> {
    const restaurant = await this.restaurantRepository
      .createQueryBuilder('restaurant')
      .leftJoinAndSelect('restaurant.tables', 'tables')
      .leftJoinAndSelect('restaurant.reviews', 'reviews')
      .where('restaurant.restaurant_id = :id', { id })
      .getOne();

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    // Вычисляем статистику
    const stats = this.calculateRestaurantStats(restaurant);

    return {
      ...restaurant,
      stats,
    };
  }

  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const restaurant = this.restaurantRepository.create({
      ...createRestaurantDto,
      country: createRestaurantDto.country || 'Грузия',
      city: createRestaurantDto.city || 'Тбилиси',
      is_active: createRestaurantDto.is_active ?? true,
      rating: 0.00, // Новый ресторан начинает с рейтинга 0
    });

    return this.restaurantRepository.save(restaurant);
  }

  async update(id: number, updateRestaurantDto: UpdateRestaurantDto): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurant_id: id },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    Object.assign(restaurant, updateRestaurantDto);
    restaurant.updated_at = new Date();

    return this.restaurantRepository.save(restaurant);
  }

  async remove(id: number): Promise<void> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurant_id: id },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    await this.restaurantRepository.remove(restaurant);
  }

  async deactivate(id: number): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurant_id: id },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    restaurant.is_active = false;
    restaurant.updated_at = new Date();

    return this.restaurantRepository.save(restaurant);
  }

  async activate(id: number): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurant_id: id },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    restaurant.is_active = true;
    restaurant.updated_at = new Date();

    return this.restaurantRepository.save(restaurant);
  }

  // Приватные методы

  private applyFilters(
    queryBuilder: SelectQueryBuilder<Restaurant>,
    filterDto: RestaurantFilterDto,
  ): void {
    const { search, city, country, is_active, min_rating } = filterDto;

    // Поиск по названию
    if (search) {
      queryBuilder.andWhere('LOWER(restaurant.restaurant_name) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    // Фильтр по городу
    if (city) {
      queryBuilder.andWhere('LOWER(restaurant.city) = LOWER(:city)', { city });
    }

    // Фильтр по стране
    if (country) {
      queryBuilder.andWhere('LOWER(restaurant.country) = LOWER(:country)', { country });
    }

    // Фильтр по активности
    if (is_active !== undefined) {
      queryBuilder.andWhere('restaurant.is_active = :isActive', { isActive: is_active });
    }

    // Фильтр по минимальному рейтингу
    if (min_rating !== undefined) {
      queryBuilder.andWhere('restaurant.rating >= :minRating', { minRating: min_rating });
    }
  }

  private calculateRestaurantStats(restaurant: any): {
    total_tables: number;
    total_capacity: number;
    total_reviews: number;
    average_rating: number;
  } {
    const tables = restaurant.tables || [];
    const reviews = restaurant.reviews || [];

    const total_tables = tables.length;
    const total_capacity = tables.reduce((sum: number, table: any) => sum + table.seats_count, 0);
    const total_reviews = reviews.length;
    const average_rating = total_reviews > 0 
      ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / total_reviews 
      : 0;

    return {
      total_tables,
      total_capacity,
      total_reviews,
      average_rating: Number(average_rating.toFixed(2)),
    };
  }
}