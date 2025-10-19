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
exports.RestaurantsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const restaurants_service_1 = require("./restaurants.service");
const restaurant_dto_1 = require("./dto/restaurant.dto");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let RestaurantsController = class RestaurantsController {
    constructor(restaurantsService) {
        this.restaurantsService = restaurantsService;
    }
    async findAll(filterDto) {
        return this.restaurantsService.findAll(filterDto);
    }
    async findOne(id) {
        return this.restaurantsService.findOne(id);
    }
    async create(createRestaurantDto) {
        return this.restaurantsService.create(createRestaurantDto);
    }
    async update(id, updateRestaurantDto) {
        return this.restaurantsService.update(id, updateRestaurantDto);
    }
    async remove(id) {
        await this.restaurantsService.remove(id);
        return { message: 'Restaurant deleted successfully' };
    }
    async deactivate(id) {
        return this.restaurantsService.deactivate(id);
    }
    async activate(id) {
        return this.restaurantsService.activate(id);
    }
};
exports.RestaurantsController = RestaurantsController;
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить список ресторанов',
        description: `Возвращает список ресторанов с поддержкой фильтрации:
    - Поиск по названию
    - Фильтр по городу и стране
    - Фильтр по активности (по умолчанию только активные)
    - Фильтр по минимальному рейтингу
    Результаты отсортированы по рейтингу (лучшие сначала)`,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Список ресторанов успешно получен',
        type: [restaurant_dto_1.RestaurantResponseDto],
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [restaurant_dto_1.RestaurantFilterDto]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить ресторан по ID',
        description: `Возвращает детальную информацию о ресторане включая:
    - Основную информацию
    - Статистику (количество столиков, вместимость, отзывы, средний рейтинг)`,
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Уникальный идентификатор ресторана',
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ресторан найден',
        type: restaurant_dto_1.RestaurantDetailResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Ресторан с указанным ID не найден',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Создать новый ресторан',
        description: 'Создает новый ресторан в системе',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Ресторан успешно создан',
        type: restaurant_dto_1.RestaurantResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Некорректные данные для создания ресторана',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [restaurant_dto_1.CreateRestaurantDto]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('manager', 'admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Обновить ресторан',
        description: 'Обновляет информацию о ресторане',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Уникальный идентификатор ресторана',
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ресторан успешно обновлен',
        type: restaurant_dto_1.RestaurantResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Ресторан с указанным ID не найден',
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Некорректные данные для обновления ресторана',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, restaurant_dto_1.UpdateRestaurantDto]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Удалить ресторан',
        description: 'Полностью удаляет ресторан из системы',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Уникальный идентификатор ресторана',
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ресторан успешно удален',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Ресторан с указанным ID не найден',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    (0, roles_decorator_1.Roles)('manager', 'admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Деактивировать ресторан',
        description: 'Помечает ресторан как неактивный (is_active = false)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Уникальный идентификатор ресторана',
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ресторан успешно деактивирован',
        type: restaurant_dto_1.RestaurantResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Ресторан с указанным ID не найден',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Patch)(':id/activate'),
    (0, roles_decorator_1.Roles)('manager', 'admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Активировать ресторан',
        description: 'Помечает ресторан как активный (is_active = true)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Уникальный идентификатор ресторана',
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ресторан успешно активирован',
        type: restaurant_dto_1.RestaurantResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Ресторан с указанным ID не найден',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "activate", null);
exports.RestaurantsController = RestaurantsController = __decorate([
    (0, swagger_1.ApiTags)('Restaurants'),
    (0, common_1.Controller)('restaurants'),
    __metadata("design:paramtypes", [restaurants_service_1.RestaurantsService])
], RestaurantsController);
//# sourceMappingURL=restaurants.controller.js.map