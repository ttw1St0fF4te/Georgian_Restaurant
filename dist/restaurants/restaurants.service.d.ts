import { Repository } from 'typeorm';
import { Restaurant } from '../entities/restaurant.entity';
import { CreateRestaurantDto, UpdateRestaurantDto, RestaurantFilterDto, RestaurantDetailResponseDto } from './dto/restaurant.dto';
export declare class RestaurantsService {
    private readonly restaurantRepository;
    constructor(restaurantRepository: Repository<Restaurant>);
    findAll(filterDto?: RestaurantFilterDto): Promise<Restaurant[]>;
    findOne(id: number): Promise<RestaurantDetailResponseDto>;
    create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant>;
    update(id: number, updateRestaurantDto: UpdateRestaurantDto): Promise<Restaurant>;
    remove(id: number): Promise<void>;
    deactivate(id: number): Promise<Restaurant>;
    activate(id: number): Promise<Restaurant>;
    private applyFilters;
    private calculateRestaurantStats;
}
