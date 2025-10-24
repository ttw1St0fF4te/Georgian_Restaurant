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
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const menu_item_entity_1 = require("../entities/menu-item.entity");
const menu_category_entity_1 = require("../entities/menu-category.entity");
const menu_dto_1 = require("./dto/menu.dto");
let MenuService = class MenuService {
    constructor(menuItemRepository, menuCategoryRepository) {
        this.menuItemRepository = menuItemRepository;
        this.menuCategoryRepository = menuCategoryRepository;
    }
    async findAll(filterDto) {
        const { search, category_id, is_vegetarian, is_spicy, min_price, max_price, max_cooking_time, max_calories, sort_by = menu_dto_1.MenuSortField.NAME, sort_order = menu_dto_1.SortOrder.ASC, page = 1, limit = 20, } = filterDto;
        const queryBuilder = this.createBaseQuery();
        this.applyFilters(queryBuilder, filterDto);
        this.applySorting(queryBuilder, sort_by, sort_order);
        const total = await queryBuilder.getCount();
        const offset = (page - 1) * limit;
        queryBuilder.skip(offset).take(limit);
        const items = await queryBuilder.getMany();
        return {
            items,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const menuItem = await this.menuItemRepository.findOne({
            where: {
                item_id: id,
                is_deleted: false,
            },
            relations: ['category'],
        });
        if (!menuItem) {
            throw new common_1.NotFoundException(`Menu item with ID ${id} not found`);
        }
        return menuItem;
    }
    async findByCategory(categoryId, filterDto) {
        const category = await this.menuCategoryRepository.findOne({
            where: { category_id: categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${categoryId} not found`);
        }
        const updatedFilter = { ...filterDto, category_id: categoryId };
        return this.findAll(updatedFilter);
    }
    async create(createMenuItemDto) {
        const category = await this.menuCategoryRepository.findOne({
            where: { category_id: createMenuItemDto.category_id },
        });
        if (!category) {
            throw new common_1.BadRequestException(`Category with ID ${createMenuItemDto.category_id} not found`);
        }
        const menuItem = this.menuItemRepository.create({
            ...createMenuItemDto,
            cooking_time_minutes: createMenuItemDto.cooking_time_minutes || 0,
            is_vegetarian: createMenuItemDto.is_vegetarian || false,
            is_spicy: createMenuItemDto.is_spicy || false,
            is_deleted: false,
        });
        return this.menuItemRepository.save(menuItem);
    }
    async update(id, updateMenuItemDto) {
        const menuItem = await this.findOne(id);
        if (updateMenuItemDto.category_id) {
            const category = await this.menuCategoryRepository.findOne({
                where: { category_id: updateMenuItemDto.category_id },
            });
            if (!category) {
                throw new common_1.BadRequestException(`Category with ID ${updateMenuItemDto.category_id} not found`);
            }
        }
        Object.assign(menuItem, updateMenuItemDto);
        menuItem.updated_at = new Date();
        return this.menuItemRepository.save(menuItem);
    }
    async remove(id) {
        const menuItem = await this.findOne(id);
        await this.menuItemRepository.remove(menuItem);
    }
    async softDelete(id) {
        const menuItem = await this.findOne(id);
        menuItem.is_deleted = true;
        menuItem.updated_at = new Date();
        return this.menuItemRepository.save(menuItem);
    }
    async restore(id) {
        const menuItem = await this.menuItemRepository.findOne({
            where: { item_id: id },
            relations: ['category'],
        });
        if (!menuItem) {
            throw new common_1.NotFoundException(`Menu item with ID ${id} not found`);
        }
        menuItem.is_deleted = false;
        menuItem.updated_at = new Date();
        return this.menuItemRepository.save(menuItem);
    }
    createBaseQuery() {
        return this.menuItemRepository
            .createQueryBuilder('menu_item')
            .leftJoinAndSelect('menu_item.category', 'category')
            .where('menu_item.is_deleted = :isDeleted', { isDeleted: false });
    }
    applyFilters(queryBuilder, filterDto) {
        const { search, category_id, is_vegetarian, is_spicy, min_price, max_price, max_cooking_time, max_calories, } = filterDto;
        if (search) {
            queryBuilder.andWhere('LOWER(menu_item.item_name) LIKE LOWER(:search)', {
                search: `%${search}%`,
            });
        }
        if (category_id) {
            queryBuilder.andWhere('menu_item.category_id = :categoryId', {
                categoryId: category_id,
            });
        }
        if (is_vegetarian !== undefined) {
            queryBuilder.andWhere('menu_item.is_vegetarian = :isVegetarian', {
                isVegetarian: is_vegetarian,
            });
        }
        if (is_spicy !== undefined) {
            queryBuilder.andWhere('menu_item.is_spicy = :isSpicy', {
                isSpicy: is_spicy,
            });
        }
        if (min_price !== undefined) {
            queryBuilder.andWhere('menu_item.price >= :minPrice', {
                minPrice: min_price,
            });
        }
        if (max_price !== undefined) {
            queryBuilder.andWhere('menu_item.price <= :maxPrice', {
                maxPrice: max_price,
            });
        }
        if (max_cooking_time !== undefined) {
            queryBuilder.andWhere('menu_item.cooking_time_minutes <= :maxCookingTime', {
                maxCookingTime: max_cooking_time,
            });
        }
        if (max_calories !== undefined) {
            queryBuilder.andWhere('menu_item.calories <= :maxCalories', {
                maxCalories: max_calories,
            });
        }
    }
    applySorting(queryBuilder, sortBy, sortOrder) {
        const columnMap = {
            [menu_dto_1.MenuSortField.PRICE]: 'menu_item.price',
            [menu_dto_1.MenuSortField.COOKING_TIME]: 'menu_item.cooking_time_minutes',
            [menu_dto_1.MenuSortField.CALORIES]: 'menu_item.calories',
            [menu_dto_1.MenuSortField.NAME]: 'menu_item.item_name',
            [menu_dto_1.MenuSortField.CREATED_AT]: 'menu_item.created_at',
        };
        const column = columnMap[sortBy];
        queryBuilder.orderBy(column, sortOrder);
    }
    async findAllForManager(filterDto) {
        const { search, category_id, is_vegetarian, is_spicy, min_price, max_price, max_cooking_time, max_calories, sort_by = menu_dto_1.MenuSortField.NAME, sort_order = menu_dto_1.SortOrder.ASC, page = 1, limit = 20, } = filterDto;
        const queryBuilder = this.menuItemRepository
            .createQueryBuilder('menu_item')
            .leftJoinAndSelect('menu_item.category', 'category');
        if (search) {
            queryBuilder.andWhere('LOWER(menu_item.item_name) LIKE LOWER(:search)', {
                search: `%${search}%`,
            });
        }
        if (category_id) {
            queryBuilder.andWhere('menu_item.category_id = :category_id', { category_id });
        }
        if (is_vegetarian !== undefined) {
            queryBuilder.andWhere('menu_item.is_vegetarian = :is_vegetarian', { is_vegetarian });
        }
        if (is_spicy !== undefined) {
            queryBuilder.andWhere('menu_item.is_spicy = :is_spicy', { is_spicy });
        }
        if (min_price !== undefined) {
            queryBuilder.andWhere('menu_item.price >= :min_price', { min_price });
        }
        if (max_price !== undefined) {
            queryBuilder.andWhere('menu_item.price <= :max_price', { max_price });
        }
        if (max_cooking_time !== undefined) {
            queryBuilder.andWhere('menu_item.cooking_time_minutes <= :max_cooking_time', { max_cooking_time });
        }
        if (max_calories !== undefined) {
            queryBuilder.andWhere('menu_item.calories <= :max_calories', { max_calories });
        }
        this.applySorting(queryBuilder, sort_by, sort_order);
        const offset = (page - 1) * limit;
        queryBuilder.skip(offset).take(limit);
        const [items, total] = await queryBuilder.getManyAndCount();
        const pages = Math.ceil(total / limit);
        return {
            items,
            total,
            page,
            limit,
            pages,
        };
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(menu_item_entity_1.MenuItem)),
    __param(1, (0, typeorm_1.InjectRepository)(menu_category_entity_1.MenuCategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MenuService);
//# sourceMappingURL=menu.service.js.map