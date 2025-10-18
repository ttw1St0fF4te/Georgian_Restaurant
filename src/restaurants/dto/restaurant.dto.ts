import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsOptional, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class RestaurantResponseDto {
  @ApiProperty({
    description: 'Уникальный идентификатор ресторана',
    example: 1,
  })
  restaurant_id: number;

  @ApiProperty({
    description: 'Название ресторана',
    example: 'Ресторан "Тбилиси"',
    minLength: 3,
    maxLength: 100,
  })
  restaurant_name: string;

  @ApiPropertyOptional({
    description: 'Описание ресторана',
    example: 'Аутентичная грузинская кухня в самом сердце города',
  })
  restaurant_description?: string;

  @ApiProperty({
    description: 'Страна',
    example: 'Грузия',
    default: 'Грузия',
  })
  country: string;

  @ApiProperty({
    description: 'Город',
    example: 'Тбилиси',
    default: 'Тбилиси',
  })
  city: string;

  @ApiProperty({
    description: 'Адрес ресторана',
    example: 'ул. Руставели, 15',
  })
  street_address: string;

  @ApiPropertyOptional({
    description: 'Часы работы по дням недели',
    example: {
      monday: '10:00-22:00',
      tuesday: '10:00-22:00',
      wednesday: '10:00-22:00',
      thursday: '10:00-22:00',
      friday: '10:00-23:00',
      saturday: '10:00-23:00',
      sunday: '12:00-21:00'
    },
  })
  working_hours?: Record<string, string>;

  @ApiProperty({
    description: 'Активен ли ресторан',
    example: true,
    default: true,
  })
  is_active: boolean;

  @ApiProperty({
    description: 'Рейтинг ресторана',
    example: 4.5,
    minimum: 0,
    maximum: 5,
  })
  rating: number;

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
}

export class RestaurantDetailResponseDto extends RestaurantResponseDto {
  @ApiPropertyOptional({
    description: 'Статистика ресторана',
  })
  stats?: {
    total_tables: number;
    total_capacity: number;
    total_reviews: number;
    average_rating: number;
  };
}

export class CreateRestaurantDto {
  @ApiProperty({
    description: 'Название ресторана',
    example: 'Ресторан "Тбилиси"',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  restaurant_name: string;

  @ApiPropertyOptional({
    description: 'Описание ресторана',
    example: 'Аутентичная грузинская кухня в самом сердце города',
  })
  @IsOptional()
  @IsString()
  restaurant_description?: string;

  @ApiPropertyOptional({
    description: 'Страна',
    example: 'Грузия',
    default: 'Грузия',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Город',
    example: 'Тбилиси',
    default: 'Тбилиси',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'Адрес ресторана',
    example: 'ул. Руставели, 15',
    minLength: 5,
  })
  @IsString()
  @IsNotEmpty()
  @Length(5)
  street_address: string;

  @ApiPropertyOptional({
    description: 'Часы работы по дням недели',
    example: {
      monday: '10:00-22:00',
      tuesday: '10:00-22:00',
      wednesday: '10:00-22:00',
      thursday: '10:00-22:00',
      friday: '10:00-23:00',
      saturday: '10:00-23:00',
      sunday: '12:00-21:00'
    },
  })
  @IsOptional()
  working_hours?: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Активен ли ресторан',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateRestaurantDto {
  @ApiPropertyOptional({
    description: 'Название ресторана',
    example: 'Ресторан "Тбилиси"',
    minLength: 3,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  restaurant_name?: string;

  @ApiPropertyOptional({
    description: 'Описание ресторана',
    example: 'Аутентичная грузинская кухня в самом сердце города',
  })
  @IsOptional()
  @IsString()
  restaurant_description?: string;

  @ApiPropertyOptional({
    description: 'Страна',
    example: 'Грузия',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Город',
    example: 'Тбилиси',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Адрес ресторана',
    example: 'ул. Руставели, 15',
    minLength: 5,
  })
  @IsOptional()
  @IsString()
  @Length(5)
  street_address?: string;

  @ApiPropertyOptional({
    description: 'Часы работы по дням недели',
    example: {
      monday: '10:00-22:00',
      tuesday: '10:00-22:00',
      wednesday: '10:00-22:00',
      thursday: '10:00-22:00',
      friday: '10:00-23:00',
      saturday: '10:00-23:00',
      sunday: '12:00-21:00'
    },
  })
  @IsOptional()
  working_hours?: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Активен ли ресторан',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({
    description: 'Рейтинг ресторана (только для админов)',
    example: 4.5,
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;
}

export class RestaurantFilterDto {
  @ApiPropertyOptional({
    description: 'Поиск по названию ресторана',
    example: 'тбилиси',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Фильтр по городу',
    example: 'Тбилиси',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Фильтр по стране',
    example: 'Грузия',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Показывать только активные рестораны',
    example: true,
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({
    description: 'Минимальный рейтинг',
    example: 4.0,
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  @Max(5)
  min_rating?: number;
}