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
exports.MenuCategoriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const menu_categories_service_1 = require("./menu-categories.service");
const menu_category_dto_1 = require("./dto/menu-category.dto");
let MenuCategoriesController = class MenuCategoriesController {
    constructor(menuCategoriesService) {
        this.menuCategoriesService = menuCategoriesService;
    }
    async findAll() {
        return this.menuCategoriesService.findAll();
    }
    async findOne(id) {
        return this.menuCategoriesService.findOne(id);
    }
    async create(createMenuCategoryDto) {
        return this.menuCategoriesService.create(createMenuCategoryDto);
    }
    async update(id, updateMenuCategoryDto) {
        return this.menuCategoriesService.update(id, updateMenuCategoryDto);
    }
    async remove(id) {
        await this.menuCategoriesService.remove(id);
        return { message: 'Category deleted successfully' };
    }
};
exports.MenuCategoriesController = MenuCategoriesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить все категории меню',
        description: 'Возвращает список всех категорий меню, отсортированных по названию',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Список категорий успешно получен',
        type: [menu_category_dto_1.MenuCategoryResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MenuCategoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить категорию по ID',
        description: 'Возвращает детальную информацию о категории меню',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Уникальный идентификатор категории',
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Категория найдена',
        type: menu_category_dto_1.MenuCategoryResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Категория с указанным ID не найдена',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MenuCategoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Создать новую категорию',
        description: 'Создает новую категорию меню',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Категория успешно создана',
        type: menu_category_dto_1.MenuCategoryResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Некорректные данные для создания категории',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [menu_category_dto_1.CreateMenuCategoryDto]),
    __metadata("design:returntype", Promise)
], MenuCategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Обновить категорию',
        description: 'Обновляет информацию о категории меню',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Уникальный идентификатор категории',
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Категория успешно обновлена',
        type: menu_category_dto_1.MenuCategoryResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Категория с указанным ID не найдена',
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Некорректные данные для обновления категории',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, menu_category_dto_1.UpdateMenuCategoryDto]),
    __metadata("design:returntype", Promise)
], MenuCategoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Удалить категорию',
        description: 'Удаляет категорию меню',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Уникальный идентификатор категории',
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Категория успешно удалена',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Категория с указанным ID не найдена',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MenuCategoriesController.prototype, "remove", null);
exports.MenuCategoriesController = MenuCategoriesController = __decorate([
    (0, swagger_1.ApiTags)('Menu Categories'),
    (0, common_1.Controller)('menu-categories'),
    __metadata("design:paramtypes", [menu_categories_service_1.MenuCategoriesService])
], MenuCategoriesController);
//# sourceMappingURL=menu-categories.controller.js.map