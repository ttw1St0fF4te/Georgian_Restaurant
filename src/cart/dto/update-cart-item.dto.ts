import { IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
  @ApiProperty({
    description: 'Новое количество блюда в корзине (1-10). Если указать 0, блюдо будет удалено из корзины',
    example: 3,
    minimum: 0,
    maximum: 10,
    type: Number,
  })
  @IsNotEmpty({ message: 'Количество обязательно' })
  @Type(() => Number)
  @IsInt({ message: 'Количество должно быть целым числом' })
  @Min(0, { message: 'Количество не может быть отрицательным' })
  @Max(10, { message: 'Количество не должно превышать 10 штук' })
  quantity: number;
}