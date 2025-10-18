import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { MenuItem } from '../entities/menu-item.entity';
import { MenuCategory } from '../entities/menu-category.entity';
import { 
  CreateMenuItemDto, 
  UpdateMenuItemDto, 
  MenuFilterDto, 
  MenuSortField, 
  SortOrder,
  MenuPaginationResponseDto
} from './dto/menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(MenuCategory)
    private readonly menuCategoryRepository: Repository<MenuCategory>,
  ) {}

  async findAll(filterDto: MenuFilterDto): Promise<MenuPaginationResponseDto> {
    const {
      search,
      category_id,
      is_vegetarian,
      is_spicy,
      min_price,
      max_price,
      max_cooking_time,
      max_calories,
      sort_by = MenuSortField.NAME,
      sort_order = SortOrder.ASC,
      page = 1,
      limit = 20,
    } = filterDto;

    const queryBuilder = this.createBaseQuery();

    // Применяем фильтры
    this.applyFilters(queryBuilder, filterDto);

    // Применяем сортировку
    this.applySorting(queryBuilder, sort_by, sort_order);

    // Подсчитываем общее количество
    const total = await queryBuilder.getCount();

    // Применяем пагинацию
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    // Получаем результаты
    const items = await queryBuilder.getMany();

    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.findOne({
      where: { 
        item_id: id,
        is_deleted: false, // Показываем только неудаленные блюда
      },
      relations: ['category'],
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    return menuItem;
  }

  async findByCategory(categoryId: number, filterDto: MenuFilterDto): Promise<MenuPaginationResponseDto> {
    // Проверяем существование категории
    const category = await this.menuCategoryRepository.findOne({
      where: { category_id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    // Добавляем фильтр по категории
    const updatedFilter = { ...filterDto, category_id: categoryId };
    return this.findAll(updatedFilter);
  }

  async create(createMenuItemDto: CreateMenuItemDto): Promise<MenuItem> {
    // Проверяем существование категории
    const category = await this.menuCategoryRepository.findOne({
      where: { category_id: createMenuItemDto.category_id },
    });

    if (!category) {
      throw new BadRequestException(`Category with ID ${createMenuItemDto.category_id} not found`);
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

  async update(id: number, updateMenuItemDto: UpdateMenuItemDto): Promise<MenuItem> {
    const menuItem = await this.findOne(id);

    // Если обновляется категория, проверяем её существование
    if (updateMenuItemDto.category_id) {
      const category = await this.menuCategoryRepository.findOne({
        where: { category_id: updateMenuItemDto.category_id },
      });

      if (!category) {
        throw new BadRequestException(`Category with ID ${updateMenuItemDto.category_id} not found`);
      }
    }

    Object.assign(menuItem, updateMenuItemDto);
    menuItem.updated_at = new Date();

    return this.menuItemRepository.save(menuItem);
  }

  async remove(id: number): Promise<void> {
    const menuItem = await this.findOne(id);
    await this.menuItemRepository.remove(menuItem);
  }

  async softDelete(id: number): Promise<MenuItem> {
    const menuItem = await this.findOne(id);
    menuItem.is_deleted = true;
    menuItem.updated_at = new Date();
    return this.menuItemRepository.save(menuItem);
  }

  async restore(id: number): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.findOne({
      where: { item_id: id },
      relations: ['category'],
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    menuItem.is_deleted = false;
    menuItem.updated_at = new Date();
    return this.menuItemRepository.save(menuItem);
  }

  // Приватные методы для построения запросов

  private createBaseQuery(): SelectQueryBuilder<MenuItem> {
    return this.menuItemRepository
      .createQueryBuilder('menu_item')
      .leftJoinAndSelect('menu_item.category', 'category')
      .where('menu_item.is_deleted = :isDeleted', { isDeleted: false });
  }

  private applyFilters(queryBuilder: SelectQueryBuilder<MenuItem>, filterDto: MenuFilterDto): void {
    const {
      search,
      category_id,
      is_vegetarian,
      is_spicy,
      min_price,
      max_price,
      max_cooking_time,
      max_calories,
    } = filterDto;

    // Поиск по названию
    if (search) {
      queryBuilder.andWhere('LOWER(menu_item.item_name) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    // Фильтр по категории
    if (category_id) {
      queryBuilder.andWhere('menu_item.category_id = :categoryId', {
        categoryId: category_id,
      });
    }

    // Фильтр по вегетарианству
    if (is_vegetarian !== undefined) {
      queryBuilder.andWhere('menu_item.is_vegetarian = :isVegetarian', {
        isVegetarian: is_vegetarian,
      });
    }

    // Фильтр по остроте
    if (is_spicy !== undefined) {
      queryBuilder.andWhere('menu_item.is_spicy = :isSpicy', {
        isSpicy: is_spicy,
      });
    }

    // Фильтр по минимальной цене
    if (min_price !== undefined) {
      queryBuilder.andWhere('menu_item.price >= :minPrice', {
        minPrice: min_price,
      });
    }

    // Фильтр по максимальной цене
    if (max_price !== undefined) {
      queryBuilder.andWhere('menu_item.price <= :maxPrice', {
        maxPrice: max_price,
      });
    }

    // Фильтр по времени приготовления
    if (max_cooking_time !== undefined) {
      queryBuilder.andWhere('menu_item.cooking_time_minutes <= :maxCookingTime', {
        maxCookingTime: max_cooking_time,
      });
    }

    // Фильтр по калориям
    if (max_calories !== undefined) {
      queryBuilder.andWhere('menu_item.calories <= :maxCalories', {
        maxCalories: max_calories,
      });
    }
  }

  private applySorting(
    queryBuilder: SelectQueryBuilder<MenuItem>,
    sortBy: MenuSortField,
    sortOrder: SortOrder,
  ): void {
    const columnMap = {
      [MenuSortField.PRICE]: 'menu_item.price',
      [MenuSortField.COOKING_TIME]: 'menu_item.cooking_time_minutes',
      [MenuSortField.CALORIES]: 'menu_item.calories',
      [MenuSortField.NAME]: 'menu_item.item_name',
      [MenuSortField.CREATED_AT]: 'menu_item.created_at',
    };

    const column = columnMap[sortBy];
    queryBuilder.orderBy(column, sortOrder);
  }
}