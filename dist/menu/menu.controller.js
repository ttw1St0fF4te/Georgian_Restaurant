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
exports.MenuController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const menu_service_1 = require("./menu.service");
const menu_dto_1 = require("./dto/menu.dto");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let MenuController = class MenuController {
    constructor(menuService) {
        this.menuService = menuService;
    }
    async findAll(filterDto) {
        return this.menuService.findAll(filterDto);
    }
    async findByCategory(categoryId, filterDto) {
        return this.menuService.findByCategory(categoryId, filterDto);
    }
    async findAllForManager(filterDto) {
        return this.menuService.findAllForManager(filterDto);
    }
    async findOne(id) {
        return this.menuService.findOne(id);
    }
    async create(createMenuItemDto) {
        return this.menuService.create(createMenuItemDto);
    }
    async update(id, updateMenuItemDto) {
        return this.menuService.update(id, updateMenuItemDto);
    }
    async remove(id) {
        await this.menuService.remove(id);
        return { message: 'Menu item deleted successfully' };
    }
    async softDelete(id) {
        return this.menuService.softDelete(id);
    }
    async restore(id) {
        return this.menuService.restore(id);
    }
};
exports.MenuController = MenuController;
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить меню с фильтрацией и поиском',
        description: `Возвращает список блюд меню с поддержкой:
    - Поиска по названию
    - Фильтрации по категории, типу блюда, цене, времени приготовления, калориям
    - Сортировки по различным полям
    - Пагинации
    Показываются только неудаленные блюда (is_deleted = false)`,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Список блюд успешно получен',
        type: menu_dto_1.MenuPaginationResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [menu_dto_1.MenuFilterDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('category/:categoryId'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить блюда по категории',
        description: 'Возвращает список блюд определенной категории с поддержкой фильтрации',
    }),
    (0, swagger_1.ApiParam)({
        name: 'categoryId',
        description: 'ID категории меню',
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Блюда категории успешно получены',
        type: menu_dto_1.MenuPaginationResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Категория с указанным ID не найдена',
    }),
    __param(0, (0, common_1.Param)('categoryId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, menu_dto_1.MenuFilterDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, roles_decorator_1.Roles)('manager', 'admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить все блюда включая удаленные',
        description: 'Возвращает список всех блюд включая мягко удаленные (is_deleted = true). Доступно только менеджерам и администраторам.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Список всех блюд успешно получен',
        type: menu_dto_1.MenuPaginationResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [menu_dto_1.MenuFilterDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "findAllForManager", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Получить блюдо по ID',
        description: 'Возвращает детальную информацию о блюде с информацией о категории',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Уникальный идентификатор блюда',
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Блюдо найдено',
        type: menu_dto_1.MenuItemResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Блюдо с указанным ID не найдено',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('manager', 'admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Создать новое блюдо',
        description: 'Создает новое блюдо в меню',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Блюдо успешно создано',
        type: menu_dto_1.MenuItemResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Некорректные данные для создания блюда или категория не найдена',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [menu_dto_1.CreateMenuItemDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('manager', 'admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Обновить блюдо',
        description: 'Обновляет информацию о блюде',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Уникальный идентификатор блюда',
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Блюдо успешно обновлено',
        type: menu_dto_1.MenuItemResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Блюдо с указанным ID не найдено',
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Некорректные данные для обновления блюда',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, menu_dto_1.UpdateMenuItemDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Удалить блюдо',
        description: 'Полностью удаляет блюдо из базы данных',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Уникальный идентификатор блюда',
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Блюдо успешно удалено',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Блюдо с указанным ID не найдено',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/soft-delete'),
    (0, roles_decorator_1.Roles)('manager', 'admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Мягкое удаление блюда',
        description: 'Помечает блюдо как удаленное (is_deleted = true), но не удаляет из БД',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Уникальный идентификатор блюда',
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Блюдо успешно помечено как удаленное',
        type: menu_dto_1.MenuItemResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Блюдо с указанным ID не найдено',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "softDelete", null);
__decorate([
    (0, common_1.Patch)(':id/restore'),
    (0, roles_decorator_1.Roles)('manager', 'admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Восстановить удаленное блюдо',
        description: 'Восстанавливает мягко удаленное блюдо (is_deleted = false)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Уникальный идентификатор блюда',
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Блюдо успешно восстановлено',
        type: menu_dto_1.MenuItemResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Блюдо с указанным ID не найдено',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "restore", null);
exports.MenuController = MenuController = __decorate([
    (0, swagger_1.ApiTags)('Menu'),
    (0, common_1.Controller)('menu'),
    __metadata("design:paramtypes", [menu_service_1.MenuService])
], MenuController);
//# sourceMappingURL=menu.controller.js.map