import { ApiProperty } from '@nestjs/swagger';

export class CartItemResponseDto {
  @ApiProperty({
    description: 'ID элемента корзины',
    example: 1,
  })
  cart_item_id: number;

  @ApiProperty({
    description: 'ID блюда',
    example: 1,
  })
  item_id: number;

  @ApiProperty({
    description: 'Название блюда',
    example: 'Хачапури по-аджарски',
  })
  item_name: string;

  @ApiProperty({
    description: 'Описание блюда',
    example: 'Традиционная лодочка из теста с сыром, маслом и яйцом',
  })
  item_description: string;

  @ApiProperty({
    description: 'Цена за единицу',
    example: 18.50,
  })
  unit_price: number;

  @ApiProperty({
    description: 'Количество в корзине',
    example: 2,
  })
  quantity: number;

  @ApiProperty({
    description: 'Общая стоимость позиции (цена * количество)',
    example: 37.00,
  })
  total_price: number;

  @ApiProperty({
    description: 'Время добавления в корзину',
    example: '2024-10-20T10:30:00.000Z',
  })
  added_at: Date;

  @ApiProperty({
    description: 'URL изображения блюда (может быть null)',
    example: 'https://example.com/khachapuri.jpg',
    nullable: true,
  })
  image_url: string | null;

  @ApiProperty({
    description: 'Категория блюда',
    example: 'Горячие блюда',
  })
  category_name: string;

  @ApiProperty({
    description: 'Вегетарианское блюдо',
    example: true,
  })
  is_vegetarian: boolean;

  @ApiProperty({
    description: 'Острое блюдо',
    example: false,
  })
  is_spicy: boolean;
}

export class CartResponseDto {
  @ApiProperty({
    description: 'ID корзины',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
  })
  cart_id: string;

  @ApiProperty({
    description: 'ID пользователя',
    example: 'f1e2d3c4-b5a6-9h8g-7j6i-5k4l3m2n1o0p',
  })
  user_id: string;

  @ApiProperty({
    description: 'Список товаров в корзине',
    type: [CartItemResponseDto],
  })
  items: CartItemResponseDto[];

  @ApiProperty({
    description: 'Общее количество единиц товаров в корзине',
    example: 5,
  })
  total_items: number;

  @ApiProperty({
    description: 'Общая стоимость корзины',
    example: 87.50,
  })
  total_amount: number;

  @ApiProperty({
    description: 'Время создания корзины',
    example: '2024-10-20T09:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Время последнего обновления корзины',
    example: '2024-10-20T10:30:00.000Z',
  })
  updated_at: Date;
}