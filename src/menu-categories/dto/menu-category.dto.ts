import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';

export class MenuCategoryResponseDto {
  @ApiProperty({
    description: 'Уникальный идентификатор категории',
    example: 1,
  })
  category_id: number;

  @ApiProperty({
    description: 'Название категории меню',
    example: 'Горячие блюда',
    minLength: 2,
    maxLength: 100,
  })
  category_name: string;

  @ApiPropertyOptional({
    description: 'Описание категории',
    example: 'Основные блюда грузинской кухни',
  })
  category_description?: string;

  @ApiProperty({
    description: 'Дата создания категории',
    example: '2024-01-15T10:30:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Дата последнего обновления',
    example: '2024-01-15T10:30:00.000Z',
  })
  updated_at: Date;
}

export class CreateMenuCategoryDto {
  @ApiProperty({
    description: 'Название категории меню',
    example: 'Горячие блюда',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  category_name: string;

  @ApiPropertyOptional({
    description: 'Описание категории',
    example: 'Основные блюда грузинской кухни',
  })
  @IsOptional()
  @IsString()
  category_description?: string;
}

export class UpdateMenuCategoryDto {
  @ApiPropertyOptional({
    description: 'Название категории меню',
    example: 'Горячие блюда',
    minLength: 2,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  category_name?: string;

  @ApiPropertyOptional({
    description: 'Описание категории',
    example: 'Основные блюда грузинской кухни',
  })
  @IsOptional()
  @IsString()
  category_description?: string;
}