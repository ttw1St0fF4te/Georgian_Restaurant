import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto, UpdateRestaurantDto, RestaurantResponseDto, RestaurantDetailResponseDto, RestaurantFilterDto } from './dto/restaurant.dto';
export declare class RestaurantsController {
    private readonly restaurantsService;
    constructor(restaurantsService: RestaurantsService);
    findAll(filterDto: RestaurantFilterDto): Promise<RestaurantResponseDto[]>;
    findOne(id: number): Promise<RestaurantDetailResponseDto>;
    create(createRestaurantDto: CreateRestaurantDto): Promise<RestaurantResponseDto>;
    update(id: number, updateRestaurantDto: UpdateRestaurantDto): Promise<RestaurantResponseDto>;
    remove(id: number): Promise<{
        message: string;
    }>;
    deactivate(id: number): Promise<RestaurantResponseDto>;
    activate(id: number): Promise<RestaurantResponseDto>;
    getRestaurantTables(id: number): Promise<any[]>;
}
