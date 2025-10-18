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
exports.RestaurantsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const restaurant_entity_1 = require("../entities/restaurant.entity");
let RestaurantsService = class RestaurantsService {
    constructor(restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }
    async findAll(filterDto = {}) {
        const { search, city, country, is_active = true, min_rating, } = filterDto;
        const queryBuilder = this.restaurantRepository.createQueryBuilder('restaurant');
        this.applyFilters(queryBuilder, filterDto);
        queryBuilder.orderBy('restaurant.rating', 'DESC');
        queryBuilder.addOrderBy('restaurant.restaurant_name', 'ASC');
        return queryBuilder.getMany();
    }
    async findOne(id) {
        const restaurant = await this.restaurantRepository
            .createQueryBuilder('restaurant')
            .leftJoinAndSelect('restaurant.tables', 'tables')
            .leftJoinAndSelect('restaurant.reviews', 'reviews')
            .where('restaurant.restaurant_id = :id', { id })
            .getOne();
        if (!restaurant) {
            throw new common_1.NotFoundException(`Restaurant with ID ${id} not found`);
        }
        const stats = this.calculateRestaurantStats(restaurant);
        return {
            ...restaurant,
            stats,
        };
    }
    async create(createRestaurantDto) {
        const restaurant = this.restaurantRepository.create({
            ...createRestaurantDto,
            country: createRestaurantDto.country || 'Грузия',
            city: createRestaurantDto.city || 'Тбилиси',
            is_active: createRestaurantDto.is_active ?? true,
            rating: 0.00,
        });
        return this.restaurantRepository.save(restaurant);
    }
    async update(id, updateRestaurantDto) {
        const restaurant = await this.restaurantRepository.findOne({
            where: { restaurant_id: id },
        });
        if (!restaurant) {
            throw new common_1.NotFoundException(`Restaurant with ID ${id} not found`);
        }
        Object.assign(restaurant, updateRestaurantDto);
        restaurant.updated_at = new Date();
        return this.restaurantRepository.save(restaurant);
    }
    async remove(id) {
        const restaurant = await this.restaurantRepository.findOne({
            where: { restaurant_id: id },
        });
        if (!restaurant) {
            throw new common_1.NotFoundException(`Restaurant with ID ${id} not found`);
        }
        await this.restaurantRepository.remove(restaurant);
    }
    async deactivate(id) {
        const restaurant = await this.restaurantRepository.findOne({
            where: { restaurant_id: id },
        });
        if (!restaurant) {
            throw new common_1.NotFoundException(`Restaurant with ID ${id} not found`);
        }
        restaurant.is_active = false;
        restaurant.updated_at = new Date();
        return this.restaurantRepository.save(restaurant);
    }
    async activate(id) {
        const restaurant = await this.restaurantRepository.findOne({
            where: { restaurant_id: id },
        });
        if (!restaurant) {
            throw new common_1.NotFoundException(`Restaurant with ID ${id} not found`);
        }
        restaurant.is_active = true;
        restaurant.updated_at = new Date();
        return this.restaurantRepository.save(restaurant);
    }
    applyFilters(queryBuilder, filterDto) {
        const { search, city, country, is_active, min_rating } = filterDto;
        if (search) {
            queryBuilder.andWhere('LOWER(restaurant.restaurant_name) LIKE LOWER(:search)', {
                search: `%${search}%`,
            });
        }
        if (city) {
            queryBuilder.andWhere('LOWER(restaurant.city) = LOWER(:city)', { city });
        }
        if (country) {
            queryBuilder.andWhere('LOWER(restaurant.country) = LOWER(:country)', { country });
        }
        if (is_active !== undefined) {
            queryBuilder.andWhere('restaurant.is_active = :isActive', { isActive: is_active });
        }
        if (min_rating !== undefined) {
            queryBuilder.andWhere('restaurant.rating >= :minRating', { minRating: min_rating });
        }
    }
    calculateRestaurantStats(restaurant) {
        const tables = restaurant.tables || [];
        const reviews = restaurant.reviews || [];
        const total_tables = tables.length;
        const total_capacity = tables.reduce((sum, table) => sum + table.seats_count, 0);
        const total_reviews = reviews.length;
        const average_rating = total_reviews > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / total_reviews
            : 0;
        return {
            total_tables,
            total_capacity,
            total_reviews,
            average_rating: Number(average_rating.toFixed(2)),
        };
    }
};
exports.RestaurantsService = RestaurantsService;
exports.RestaurantsService = RestaurantsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(restaurant_entity_1.Restaurant)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RestaurantsService);
//# sourceMappingURL=restaurants.service.js.map