import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuCategory } from '../entities/menu-category.entity';
import { CreateMenuCategoryDto, UpdateMenuCategoryDto } from './dto/menu-category.dto';

@Injectable()
export class MenuCategoriesService {
  constructor(
    @InjectRepository(MenuCategory)
    private readonly menuCategoryRepository: Repository<MenuCategory>,
  ) {}

  async findAll(): Promise<MenuCategory[]> {
    return this.menuCategoryRepository.find({
      order: {
        category_name: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<MenuCategory> {
    const category = await this.menuCategoryRepository.findOne({
      where: { category_id: id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async create(createMenuCategoryDto: CreateMenuCategoryDto): Promise<MenuCategory> {
    const category = this.menuCategoryRepository.create(createMenuCategoryDto);
    return this.menuCategoryRepository.save(category);
  }

  async update(id: number, updateMenuCategoryDto: UpdateMenuCategoryDto): Promise<MenuCategory> {
    const category = await this.findOne(id);
    
    Object.assign(category, updateMenuCategoryDto);
    category.updated_at = new Date();
    
    return this.menuCategoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.menuCategoryRepository.remove(category);
  }
}