import { Repository } from 'typeorm';
import { MenuCategory } from '../entities/menu-category.entity';
import { CreateMenuCategoryDto, UpdateMenuCategoryDto } from './dto/menu-category.dto';
export declare class MenuCategoriesService {
    private readonly menuCategoryRepository;
    constructor(menuCategoryRepository: Repository<MenuCategory>);
    findAll(): Promise<MenuCategory[]>;
    findOne(id: number): Promise<MenuCategory>;
    create(createMenuCategoryDto: CreateMenuCategoryDto): Promise<MenuCategory>;
    update(id: number, updateMenuCategoryDto: UpdateMenuCategoryDto): Promise<MenuCategory>;
    remove(id: number): Promise<void>;
}
