import { MenuCategoriesService } from './menu-categories.service';
import { CreateMenuCategoryDto, UpdateMenuCategoryDto, MenuCategoryResponseDto } from './dto/menu-category.dto';
export declare class MenuCategoriesController {
    private readonly menuCategoriesService;
    constructor(menuCategoriesService: MenuCategoriesService);
    findAll(): Promise<MenuCategoryResponseDto[]>;
    findOne(id: number): Promise<MenuCategoryResponseDto>;
    create(createMenuCategoryDto: CreateMenuCategoryDto): Promise<MenuCategoryResponseDto>;
    update(id: number, updateMenuCategoryDto: UpdateMenuCategoryDto): Promise<MenuCategoryResponseDto>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
