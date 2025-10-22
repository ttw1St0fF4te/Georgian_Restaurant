import { IsNotEmpty, IsInt, IsDateString, IsString, IsPhoneNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @ApiProperty({
    description: 'ID ресторана для бронирования',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  restaurant_id: number;

  @ApiProperty({
    description: 'ID столика для бронирования',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  table_id: number;

  @ApiProperty({
    description: 'Дата бронирования (YYYY-MM-DD)',
    example: '2025-10-25',
  })
  @IsDateString()
  @IsNotEmpty()
  reservation_date: string;

  @ApiProperty({
    description: 'Время начала бронирования (HH:MM)',
    example: '18:00',
  })
  @IsString()
  @IsNotEmpty()
  reservation_time: string;

  @ApiProperty({
    description: 'Продолжительность бронирования в часах (1-8)',
    example: 2,
    minimum: 1,
    maximum: 8,
  })
  @IsInt()
  @Min(1)
  @Max(8)
  @Type(() => Number)
  duration_hours: number;

  @ApiProperty({
    description: 'Количество гостей',
    example: 4,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  guests_count: number;

  @ApiProperty({
    description: 'Контактный телефон',
    example: '+995555123456',
  })
  @IsString()
  @IsNotEmpty()
  contact_phone: string;
}