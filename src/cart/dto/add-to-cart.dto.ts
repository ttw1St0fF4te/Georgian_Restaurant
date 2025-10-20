import { IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({
    description: 'ID блюда из меню',
    example: 1,
    type: Number,
  })
  @IsNotEmpty({ message: 'ID блюда обязателен' })
  @Type(() => Number)
  @IsInt({ message: 'ID блюда должен быть числом' })
  @Min(1, { message: 'ID блюда должен быть положительным числом' })
  item_id: number;

  @ApiProperty({
    description: 'Количество блюд для добавления в корзину (1-10)',
    example: 2,
    minimum: 1,
    maximum: 10,
    type: Number,
  })
  @IsNotEmpty({ message: 'Количество обязательно' })
  @Type(() => Number)
  @IsInt({ message: 'Количество должно быть целым числом' })
  @Min(1, { message: 'Количество должно быть не менее 1' })
  @Max(10, { message: 'Количество не должно превышать 10 штук за один раз' })
  quantity: number;
}