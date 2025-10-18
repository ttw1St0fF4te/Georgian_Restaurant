import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { MenuService } from './menu.service';
import {
  CreateMenuItemDto,
  UpdateMenuItemDto,
  MenuItemResponseDto,
  MenuFilterDto,
  MenuPaginationResponseDto,
} from './dto/menu.dto';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @ApiOperation({
    summary: 'Получить меню с фильтрацией и поиском',
    description: `Возвращает список блюд меню с поддержкой:
    - Поиска по названию
    - Фильтрации по категории, типу блюда, цене, времени приготовления, калориям
    - Сортировки по различным полям
    - Пагинации
    Показываются только неудаленные блюда (is_deleted = false)`,
  })
  @ApiResponse({
    status: 200,
    description: 'Список блюд успешно получен',
    type: MenuPaginationResponseDto,
  })
  async findAll(@Query() filterDto: MenuFilterDto): Promise<MenuPaginationResponseDto> {
    return this.menuService.findAll(filterDto);
  }

  @Get('category/:categoryId')
  @ApiOperation({
    summary: 'Получить блюда по категории',
    description: 'Возвращает список блюд определенной категории с поддержкой фильтрации',
  })
  @ApiParam({
    name: 'categoryId',
    description: 'ID категории меню',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Блюда категории успешно получены',
    type: MenuPaginationResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Категория с указанным ID не найдена',
  })
  async findByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Query() filterDto: MenuFilterDto,
  ): Promise<MenuPaginationResponseDto> {
    return this.menuService.findByCategory(categoryId, filterDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Получить блюдо по ID',
    description: 'Возвращает детальную информацию о блюде с информацией о категории',
  })
  @ApiParam({
    name: 'id',
    description: 'Уникальный идентификатор блюда',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Блюдо найдено',
    type: MenuItemResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Блюдо с указанным ID не найдено',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<MenuItemResponseDto> {
    return this.menuService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Создать новое блюдо',
    description: 'Создает новое блюдо в меню',
  })
  @ApiResponse({
    status: 201,
    description: 'Блюдо успешно создано',
    type: MenuItemResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Некорректные данные для создания блюда или категория не найдена',
  })
  async create(@Body() createMenuItemDto: CreateMenuItemDto): Promise<MenuItemResponseDto> {
    return this.menuService.create(createMenuItemDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Обновить блюдо',
    description: 'Обновляет информацию о блюде',
  })
  @ApiParam({
    name: 'id',
    description: 'Уникальный идентификатор блюда',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Блюдо успешно обновлено',
    type: MenuItemResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Блюдо с указанным ID не найдено',
  })
  @ApiBadRequestResponse({
    description: 'Некорректные данные для обновления блюда',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ): Promise<MenuItemResponseDto> {
    return this.menuService.update(id, updateMenuItemDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Удалить блюдо',
    description: 'Полностью удаляет блюдо из базы данных',
  })
  @ApiParam({
    name: 'id',
    description: 'Уникальный идентификатор блюда',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Блюдо успешно удалено',
  })
  @ApiNotFoundResponse({
    description: 'Блюдо с указанным ID не найдено',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.menuService.remove(id);
    return { message: 'Menu item deleted successfully' };
  }

  @Patch(':id/soft-delete')
  @ApiOperation({
    summary: 'Мягкое удаление блюда',
    description: 'Помечает блюдо как удаленное (is_deleted = true), но не удаляет из БД',
  })
  @ApiParam({
    name: 'id',
    description: 'Уникальный идентификатор блюда',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Блюдо успешно помечено как удаленное',
    type: MenuItemResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Блюдо с указанным ID не найдено',
  })
  async softDelete(@Param('id', ParseIntPipe) id: number): Promise<MenuItemResponseDto> {
    return this.menuService.softDelete(id);
  }

  @Patch(':id/restore')
  @ApiOperation({
    summary: 'Восстановить удаленное блюдо',
    description: 'Восстанавливает мягко удаленное блюдо (is_deleted = false)',
  })
  @ApiParam({
    name: 'id',
    description: 'Уникальный идентификатор блюда',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Блюдо успешно восстановлено',
    type: MenuItemResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Блюдо с указанным ID не найдено',
  })
  async restore(@Param('id', ParseIntPipe) id: number): Promise<MenuItemResponseDto> {
    return this.menuService.restore(id);
  }
}