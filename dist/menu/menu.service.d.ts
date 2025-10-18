import { Repository } from 'typeorm';
import { MenuItem } from '../entities/menu-item.entity';
import { MenuCategory } from '../entities/menu-category.entity';
import { CreateMenuItemDto, UpdateMenuItemDto, MenuFilterDto, MenuPaginationResponseDto } from './dto/menu.dto';
export declare class MenuService {
    private readonly menuItemRepository;
    private readonly menuCategoryRepository;
    constructor(menuItemRepository: Repository<MenuItem>, menuCategoryRepository: Repository<MenuCategory>);
    findAll(filterDto: MenuFilterDto): Promise<MenuPaginationResponseDto>;
    findOne(id: number): Promise<MenuItem>;
    findByCategory(categoryId: number, filterDto: MenuFilterDto): Promise<MenuPaginationResponseDto>;
    create(createMenuItemDto: CreateMenuItemDto): Promise<MenuItem>;
    update(id: number, updateMenuItemDto: UpdateMenuItemDto): Promise<MenuItem>;
    remove(id: number): Promise<void>;
    softDelete(id: number): Promise<MenuItem>;
    restore(id: number): Promise<MenuItem>;
    private createBaseQuery;
    private applyFilters;
    private applySorting;
}
