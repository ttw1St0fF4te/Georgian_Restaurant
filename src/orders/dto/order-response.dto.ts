import { ApiProperty } from '@nestjs/swagger';
import { OrderType } from '../../entities/order.entity';

export class OrderResponseDto {
  @ApiProperty({
    description: 'ID заказа',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  order_id: string;

  @ApiProperty({
    description: 'ID пользователя',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  user_id: string;

  @ApiProperty({
    description: 'Тип заказа',
    enum: OrderType,
    example: 'delivery'
  })
  order_type: OrderType;

  @ApiProperty({
    description: 'Страна доставки',
    example: 'Грузия',
    nullable: true
  })
  delivery_country?: string;

  @ApiProperty({
    description: 'Город доставки',
    example: 'Тбилиси',
    nullable: true
  })
  delivery_city?: string;

  @ApiProperty({
    description: 'Адрес доставки',
    example: 'ул. Руставели, 15, кв. 10',
    nullable: true
  })
  delivery_street_address?: string;

  @ApiProperty({
    description: 'Телефон доставки',
    example: '+995555123456',
    nullable: true
  })
  delivery_phone?: string;

  @ApiProperty({
    description: 'ID бронирования',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true
  })
  reservation_id?: string;

  @ApiProperty({
    description: 'Стоимость товаров',
    example: 45.50
  })
  subtotal: number;

  @ApiProperty({
    description: 'Стоимость доставки',
    example: 2.28
  })
  delivery_fee: number;

  @ApiProperty({
    description: 'Общая стоимость',
    example: 47.78
  })
  total_amount: number;

  @ApiProperty({
    description: 'Дата создания заказа',
    example: '2025-10-23T10:30:00Z'
  })
  created_at: Date;

  @ApiProperty({
    description: 'Дата последнего обновления',
    example: '2025-10-23T10:30:00Z'
  })
  updated_at: Date;

  @ApiProperty({
    description: 'Позиции заказа',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        order_item_id: { type: 'number', example: 1 },
        item_id: { type: 'number', example: 5 },
        item_name: { type: 'string', example: 'Хачапури по-аджарски' },
        quantity: { type: 'number', example: 2 },
        unit_price: { type: 'number', example: 18.50 },
        total_price: { type: 'number', example: 37.00 }
      }
    }
  })
  order_items?: OrderItemResponseDto[];
}

export class OrderItemResponseDto {
  @ApiProperty({
    description: 'ID позиции заказа',
    example: 1
  })
  order_item_id: number;

  @ApiProperty({
    description: 'ID блюда',
    example: 5
  })
  item_id: number;

  @ApiProperty({
    description: 'Название блюда',
    example: 'Хачапури по-аджарски'
  })
  item_name: string;

  @ApiProperty({
    description: 'Количество',
    example: 2
  })
  quantity: number;

  @ApiProperty({
    description: 'Цена за единицу',
    example: 18.50
  })
  unit_price: number;

  @ApiProperty({
    description: 'Общая стоимость позиции',
    example: 37.00
  })
  total_price: number;
}