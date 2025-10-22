import { ApiProperty } from '@nestjs/swagger';
import { ReservationStatus } from '../../entities/table-reservation.entity';

export class ReservationResponseDto {
  @ApiProperty({
    description: 'ID бронирования',
    example: 'b42bb960-ff62-4ca6-8e9d-c47ce9470ed6',
  })
  reservation_id: string;

  @ApiProperty({
    description: 'ID пользователя',
    example: 'a32cc850-ee52-3ba6-7d8c-b47ce9470ed5',
  })
  user_id: string;

  @ApiProperty({
    description: 'ID ресторана',
    example: 1,
  })
  restaurant_id: number;

  @ApiProperty({
    description: 'Название ресторана',
    example: 'Тбилисо',
  })
  restaurant_name: string;

  @ApiProperty({
    description: 'ID столика',
    example: 1,
  })
  table_id: number;

  @ApiProperty({
    description: 'Номер столика',
    example: 5,
  })
  table_number: number;

  @ApiProperty({
    description: 'Количество мест за столиком',
    example: 4,
  })
  seats_count: number;

  @ApiProperty({
    description: 'Дата бронирования',
    example: '2025-10-25',
  })
  reservation_date: string;

  @ApiProperty({
    description: 'Время начала бронирования',
    example: '18:00:00',
  })
  reservation_time: string;

  @ApiProperty({
    description: 'Продолжительность в часах',
    example: 2,
  })
  duration_hours: number;

  @ApiProperty({
    description: 'Количество гостей',
    example: 4,
  })
  guests_count: number;

  @ApiProperty({
    description: 'Статус бронирования',
    enum: ReservationStatus,
    example: ReservationStatus.UNCONFIRMED,
  })
  reservation_status: ReservationStatus;

  @ApiProperty({
    description: 'Контактный телефон',
    example: '+995555123456',
  })
  contact_phone: string;

  @ApiProperty({
    description: 'Дата создания бронирования',
    example: '2025-10-22T15:30:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Дата последнего обновления',
    example: '2025-10-22T15:30:00.000Z',
  })
  updated_at: Date;

  @ApiProperty({
    description: 'Дата подтверждения бронирования (если подтверждена)',
    example: '2025-10-22T16:00:00.000Z',
    required: false,
  })
  confirmed_at?: Date;
}