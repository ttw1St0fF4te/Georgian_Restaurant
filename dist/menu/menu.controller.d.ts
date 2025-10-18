import { MenuService } from './menu.service';
import { CreateMenuItemDto, UpdateMenuItemDto, MenuItemResponseDto, MenuFilterDto, MenuPaginationResponseDto } from './dto/menu.dto';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    findAll(filterDto: MenuFilterDto): Promise<MenuPaginationResponseDto>;
    findByCategory(categoryId: number, filterDto: MenuFilterDto): Promise<MenuPaginationResponseDto>;
    findOne(id: number): Promise<MenuItemResponseDto>;
    create(createMenuItemDto: CreateMenuItemDto): Promise<MenuItemResponseDto>;
    update(id: number, updateMenuItemDto: UpdateMenuItemDto): Promise<MenuItemResponseDto>;
    remove(id: number): Promise<{
        message: string;
    }>;
    softDelete(id: number): Promise<MenuItemResponseDto>;
    restore(id: number): Promise<MenuItemResponseDto>;
}
