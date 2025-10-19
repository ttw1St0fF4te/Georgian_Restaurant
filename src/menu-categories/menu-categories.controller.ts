import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MenuCategoriesService } from './menu-categories.service';
import {
  CreateMenuCategoryDto,
  UpdateMenuCategoryDto,
  MenuCategoryResponseDto,
} from './dto/menu-category.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Menu Categories')
@Controller('menu-categories')
export class MenuCategoriesController {
  constructor(private readonly menuCategoriesService: MenuCategoriesService) {}

  @Get()
  @Public() // Доступно всем
  @ApiOperation({
    summary: 'Получить все категории меню',
    description: 'Возвращает список всех категорий меню, отсортированных по названию',
  })
  @ApiResponse({
    status: 200,
    description: 'Список категорий успешно получен',
    type: [MenuCategoryResponseDto],
  })
  async findAll(): Promise<MenuCategoryResponseDto[]> {
    return this.menuCategoriesService.findAll();
  }

  @Get(':id')
  @Public() // Доступно всем
  @ApiOperation({
    summary: 'Получить категорию по ID',
    description: 'Возвращает детальную информацию о категории меню',
  })
  @ApiParam({
    name: 'id',
    description: 'Уникальный идентификатор категории',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Категория найдена',
    type: MenuCategoryResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Категория с указанным ID не найдена',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<MenuCategoryResponseDto> {
    return this.menuCategoriesService.findOne(id);
  }

  @Post()
  @Roles('manager', 'admin') // Менеджеры и администраторы
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Создать новую категорию',
    description: 'Создает новую категорию меню',
  })
  @ApiResponse({
    status: 201,
    description: 'Категория успешно создана',
    type: MenuCategoryResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Некорректные данные для создания категории',
  })
  async create(@Body() createMenuCategoryDto: CreateMenuCategoryDto): Promise<MenuCategoryResponseDto> {
    return this.menuCategoriesService.create(createMenuCategoryDto);
  }

  @Patch(':id')
  @Roles('manager', 'admin') // Менеджеры и администраторы
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Обновить категорию',
    description: 'Обновляет информацию о категории меню',
  })
  @ApiParam({
    name: 'id',
    description: 'Уникальный идентификатор категории',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Категория успешно обновлена',
    type: MenuCategoryResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Категория с указанным ID не найдена',
  })
  @ApiBadRequestResponse({
    description: 'Некорректные данные для обновления категории',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuCategoryDto: UpdateMenuCategoryDto,
  ): Promise<MenuCategoryResponseDto> {
    return this.menuCategoriesService.update(id, updateMenuCategoryDto);
  }

  @Delete(':id')
  @Roles('admin') // Только администраторы
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Удалить категорию',
    description: 'Удаляет категорию меню',
  })
  @ApiParam({
    name: 'id',
    description: 'Уникальный идентификатор категории',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Категория успешно удалена',
  })
  @ApiNotFoundResponse({
    description: 'Категория с указанным ID не найдена',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.menuCategoriesService.remove(id);
    return { message: 'Category deleted successfully' };
  }
}