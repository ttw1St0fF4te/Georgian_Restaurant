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
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import {
  CreateRestaurantDto,
  UpdateRestaurantDto,
  RestaurantResponseDto,
  RestaurantDetailResponseDto,
  RestaurantFilterDto,
} from './dto/restaurant.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  @Public() // Доступно всем для просмотра списка ресторанов
  @ApiOperation({
    summary: 'Получить список ресторанов',
    description: `Возвращает список ресторанов с поддержкой фильтрации:
    - Поиск по названию
    - Фильтр по городу и стране
    - Фильтр по активности (по умолчанию только активные)
    - Фильтр по минимальному рейтингу
    Результаты отсортированы по рейтингу (лучшие сначала)`,
  })
  @ApiResponse({
    status: 200,
    description: 'Список ресторанов успешно получен',
    type: [RestaurantResponseDto],
  })
  async findAll(@Query() filterDto: RestaurantFilterDto): Promise<RestaurantResponseDto[]> {
    return this.restaurantsService.findAll(filterDto);
  }

  @Get(':id')
  @Public() // Доступно всем для просмотра деталей ресторана
  @ApiOperation({
    summary: 'Получить ресторан по ID',
    description: `Возвращает детальную информацию о ресторане включая:
    - Основную информацию
    - Статистику (количество столиков, вместимость, отзывы, средний рейтинг)`,
  })
  @ApiParam({
    name: 'id',
    description: 'Уникальный идентификатор ресторана',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Ресторан найден',
    type: RestaurantDetailResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Ресторан с указанным ID не найден',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<RestaurantDetailResponseDto> {
    return this.restaurantsService.findOne(id);
  }

  @Post()
  @Roles('admin') // Только администраторы могут создавать рестораны
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Создать новый ресторан',
    description: 'Создает новый ресторан в системе',
  })
  @ApiResponse({
    status: 201,
    description: 'Ресторан успешно создан',
    type: RestaurantResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Некорректные данные для создания ресторана',
  })
  async create(@Body() createRestaurantDto: CreateRestaurantDto): Promise<RestaurantResponseDto> {
    return this.restaurantsService.create(createRestaurantDto);
  }

  @Patch(':id')
  @Roles('manager', 'admin') // Менеджеры и администраторы
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Обновить ресторан',
    description: 'Обновляет информацию о ресторане',
  })
  @ApiParam({
    name: 'id',
    description: 'Уникальный идентификатор ресторана',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Ресторан успешно обновлен',
    type: RestaurantResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Ресторан с указанным ID не найден',
  })
  @ApiBadRequestResponse({
    description: 'Некорректные данные для обновления ресторана',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<RestaurantResponseDto> {
    return this.restaurantsService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  @Roles('admin') // Только администраторы могут полностью удалять рестораны
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Удалить ресторан',
    description: 'Полностью удаляет ресторан из системы',
  })
  @ApiParam({
    name: 'id',
    description: 'Уникальный идентификатор ресторана',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Ресторан успешно удален',
  })
  @ApiNotFoundResponse({
    description: 'Ресторан с указанным ID не найден',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.restaurantsService.remove(id);
    return { message: 'Restaurant deleted successfully' };
  }

  @Patch(':id/deactivate')
  @Roles('manager', 'admin') // Менеджеры и администраторы
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Деактивировать ресторан',
    description: 'Помечает ресторан как неактивный (is_active = false)',
  })
  @ApiParam({
    name: 'id',
    description: 'Уникальный идентификатор ресторана',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Ресторан успешно деактивирован',
    type: RestaurantResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Ресторан с указанным ID не найден',
  })
  async deactivate(@Param('id', ParseIntPipe) id: number): Promise<RestaurantResponseDto> {
    return this.restaurantsService.deactivate(id);
  }

  @Patch(':id/activate')
  @Roles('manager', 'admin') // Менеджеры и администраторы
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Активировать ресторан',
    description: 'Помечает ресторан как активный (is_active = true)',
  })
  @ApiParam({
    name: 'id',
    description: 'Уникальный идентификатор ресторана',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Ресторан успешно активирован',
    type: RestaurantResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Ресторан с указанным ID не найден',
  })
  async activate(@Param('id', ParseIntPipe) id: number): Promise<RestaurantResponseDto> {
    return this.restaurantsService.activate(id);
  }

  @Get(':id/tables')
  @Public() // Доступно всем для просмотра столиков ресторана
  @ApiOperation({
    summary: 'Получить столики ресторана',
    description: 'Возвращает список всех столиков указанного ресторана с информацией о вместимости',
  })
  @ApiParam({
    name: 'id',
    description: 'Уникальный идентификатор ресторана',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Список столиков ресторана',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          table_id: { type: 'number', example: 1 },
          table_number: { type: 'number', example: 5 },
          seats_count: { type: 'number', example: 4 },
          is_available: { type: 'boolean', example: true },
          restaurant_id: { type: 'number', example: 1 },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Ресторан с указанным ID не найден',
  })
  async getRestaurantTables(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantsService.getRestaurantTables(id);
  }
}