import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  Length, 
  IsOptional, 
  IsNumber, 
  IsBoolean, 
  IsPositive,
  Min,
  IsInt,
  IsEnum
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

// Response DTO
export class MenuItemResponseDto {
  @ApiProperty({
    description: 'Уникальный идентификатор блюда',
    example: 1,
  })
  item_id: number;

  @ApiProperty({
    description: 'Название блюда',
    example: 'Хачапури по-аджарски',
    minLength: 3,
    maxLength: 150,
  })
  item_name: string;

  @ApiPropertyOptional({
    description: 'Описание блюда',
    example: 'Традиционная грузинская лепешка с сыром и яйцом',
  })
  item_description?: string;

  @ApiProperty({
    description: 'ID категории меню',
    example: 1,
  })
  category_id: number;

  @ApiProperty({
    description: 'Стоимость блюда',
    example: 25.50,
  })
  price: number;

  @ApiProperty({
    description: 'Время приготовления в минутах',
    example: 15,
  })
  cooking_time_minutes: number;

  @ApiPropertyOptional({
    description: 'Калории',
    example: 350,
  })
  calories?: number;

  @ApiProperty({
    description: 'Вегетарианское блюдо',
    example: false,
  })
  is_vegetarian: boolean;

  @ApiProperty({
    description: 'Острое блюдо',
    example: false,
  })
  is_spicy: boolean;

  @ApiProperty({
    description: 'Удалено (мягкое удаление)',
    example: false,
  })
  is_deleted: boolean;

  @ApiPropertyOptional({
    description: 'URL изображения блюда',
    example: 'https://example.com/image.jpg',
  })
  image_url?: string;

  @ApiProperty({
    description: 'Дата создания',
    example: '2024-01-15T10:30:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Дата последнего обновления',
    example: '2024-01-15T10:30:00.000Z',
  })
  updated_at: Date;

  @ApiPropertyOptional({
    description: 'Информация о категории',
  })
  category?: {
    category_id: number;
    category_name: string;
    category_description?: string;
  };
}

// Enum для сортировки
export enum MenuSortField {
  PRICE = 'price',
  COOKING_TIME = 'cooking_time_minutes',
  CALORIES = 'calories',
  NAME = 'item_name',
  CREATED_AT = 'created_at',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

// DTO для фильтрации и поиска
export class MenuFilterDto {
  @ApiPropertyOptional({
    description: 'Поиск по названию блюда',
    example: 'хачапури',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Фильтр по категории',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  category_id?: number;

  @ApiPropertyOptional({
    description: 'Фильтр только вегетарианских блюд',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  is_vegetarian?: boolean;

  @ApiPropertyOptional({
    description: 'Фильтр только острых блюд',
    example: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  is_spicy?: boolean;

  @ApiPropertyOptional({
    description: 'Минимальная цена',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  min_price?: number;

  @ApiPropertyOptional({
    description: 'Максимальная цена',
    example: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  max_price?: number;

  @ApiPropertyOptional({
    description: 'Максимальное время приготовления',
    example: 30,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  max_cooking_time?: number;

  @ApiPropertyOptional({
    description: 'Максимальное количество калорий',
    example: 500,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  max_calories?: number;

  @ApiPropertyOptional({
    description: 'Поле для сортировки',
    enum: MenuSortField,
    example: MenuSortField.PRICE,
  })
  @IsOptional()
  @IsEnum(MenuSortField)
  sort_by?: MenuSortField;

  @ApiPropertyOptional({
    description: 'Порядок сортировки',
    enum: SortOrder,
    example: SortOrder.ASC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sort_order?: SortOrder;

  @ApiPropertyOptional({
    description: 'Номер страницы (для пагинации)',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Количество элементов на странице',
    example: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

// Create DTO
export class CreateMenuItemDto {
  @ApiProperty({
    description: 'Название блюда',
    example: 'Хачапури по-аджарски',
    minLength: 3,
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 150)
  item_name: string;

  @ApiPropertyOptional({
    description: 'Описание блюда',
    example: 'Традиционная грузинская лепешка с сыром и яйцом',
  })
  @IsOptional()
  @IsString()
  item_description?: string;

  @ApiProperty({
    description: 'ID категории меню',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  category_id: number;

  @ApiProperty({
    description: 'Стоимость блюда',
    example: 25.50,
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiPropertyOptional({
    description: 'Время приготовления в минутах',
    example: 15,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  cooking_time_minutes?: number;

  @ApiPropertyOptional({
    description: 'Калории',
    example: 350,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  calories?: number;

  @ApiPropertyOptional({
    description: 'Вегетарианское блюдо',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  is_vegetarian?: boolean;

  @ApiPropertyOptional({
    description: 'Острое блюдо',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  is_spicy?: boolean;

  @ApiPropertyOptional({
    description: 'URL изображения блюда',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsString()
  image_url?: string;
}

// Update DTO
export class UpdateMenuItemDto {
  @ApiPropertyOptional({
    description: 'Название блюда',
    example: 'Хачапури по-аджарски',
    minLength: 3,
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(3, 150)
  item_name?: string;

  @ApiPropertyOptional({
    description: 'Описание блюда',
    example: 'Традиционная грузинская лепешка с сыром и яйцом',
  })
  @IsOptional()
  @IsString()
  item_description?: string;

  @ApiPropertyOptional({
    description: 'ID категории меню',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  category_id?: number;

  @ApiPropertyOptional({
    description: 'Стоимость блюда',
    example: 25.50,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiPropertyOptional({
    description: 'Время приготовления в минутах',
    example: 15,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  cooking_time_minutes?: number;

  @ApiPropertyOptional({
    description: 'Калории',
    example: 350,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  calories?: number;

  @ApiPropertyOptional({
    description: 'Вегетарианское блюдо',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  is_vegetarian?: boolean;

  @ApiPropertyOptional({
    description: 'Острое блюдо',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  is_spicy?: boolean;

  @ApiPropertyOptional({
    description: 'URL изображения блюда',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsString()
  image_url?: string;
}

// Response для пагинации
export class MenuPaginationResponseDto {
  @ApiProperty({
    description: 'Список блюд',
    type: [MenuItemResponseDto],
  })
  items: MenuItemResponseDto[];

  @ApiProperty({
    description: 'Общее количество блюд',
    example: 45,
  })
  total: number;

  @ApiProperty({
    description: 'Текущая страница',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Количество элементов на странице',
    example: 20,
  })
  limit: number;

  @ApiProperty({
    description: 'Общее количество страниц',
    example: 3,
  })
  pages: number;
}