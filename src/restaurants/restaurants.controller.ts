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
} from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import {
  CreateRestaurantDto,
  UpdateRestaurantDto,
  RestaurantResponseDto,
  RestaurantDetailResponseDto,
  RestaurantFilterDto,
} from './dto/restaurant.dto';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
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
}