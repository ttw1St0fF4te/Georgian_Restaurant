import { IsEnum, IsOptional, IsString, IsBoolean, IsUUID, IsNotEmpty, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderType } from '../../entities/order.entity';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Тип заказа',
    enum: OrderType,
    example: 'delivery'
  })
  @IsEnum(OrderType, { message: 'Тип заказа должен быть delivery или dine_in' })
  order_type: OrderType;

  // Поля для доставки (обязательны только для delivery)
  @ApiProperty({
    description: 'Страна доставки (только для delivery)',
    example: 'Грузия',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Страна должна быть строкой' })
  @Length(2, 50, { message: 'Страна должна быть от 2 до 50 символов' })
  delivery_country?: string;

  @ApiProperty({
    description: 'Город доставки (только для delivery)',
    example: 'Тбилиси',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Город должен быть строкой' })
  @Length(2, 100, { message: 'Город должен быть от 2 до 100 символов' })
  delivery_city?: string;

  @ApiProperty({
    description: 'Адрес доставки (только для delivery)',
    example: 'ул. Руставели, 15, кв. 10',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Адрес должен быть строкой' })
  @Length(5, 500, { message: 'Адрес должен быть от 5 до 500 символов' })
  delivery_street_address?: string;

  @ApiProperty({
    description: 'Телефон для доставки (только для delivery)',
    example: '+995555123456',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Телефон должен быть строкой' })
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Телефон должен быть в правильном формате' })
  delivery_phone?: string;

  // Поле для заказа в ресторане (обязательно только для dine_in)
  @ApiProperty({
    description: 'ID бронирования (только для dine_in)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsOptional()
  @IsUUID(4, { message: 'ID бронирования должен быть корректным UUID' })
  reservation_id?: string;

  // Опциональное поле для обновления адреса пользователя
  @ApiProperty({
    description: 'Обновить ли адрес пользователя указанным адресом доставки',
    example: false,
    required: false,
    default: false
  })
  @IsOptional()
  @IsBoolean({ message: 'Поле должно быть boolean' })
  should_update_user_address?: boolean = false;
}