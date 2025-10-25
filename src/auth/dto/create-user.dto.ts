import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'newuser123',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 20, { message: 'Имя пользователя должно содержать от 3 до 20 символов' })
  @Matches(/^[a-zA-Z0-9_-]+$/, { 
    message: 'Имя пользователя может содержать только буквы, цифры, подчёркивание и дефис' 
  })
  username: string;

  @ApiProperty({
    description: 'Email адрес',
    example: 'newuser@example.com',
  })
  @IsEmail({}, { message: 'Email должен быть действительным адресом электронной почты' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Пароль',
    example: 'StrongPass123!',
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 50, { message: 'Пароль должен содержать от 8 до 50 символов' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Пароль должен содержать минимум одну строчную букву, одну заглавную букву, одну цифру и один специальный символ'
  })
  password: string;

  @ApiProperty({
    description: 'Имя',
    example: 'Иван',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50, { message: 'Имя должно содержать от 2 до 50 символов' })
  @Matches(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, { 
    message: 'Имя может содержать только буквы, пробелы и дефисы' 
  })
  first_name: string;

  @ApiProperty({
    description: 'Фамилия',
    example: 'Иванов',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50, { message: 'Фамилия должна содержать от 2 до 50 символов' })
  @Matches(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, { 
    message: 'Фамилия может содержать только буквы, пробелы и дефисы' 
  })
  last_name: string;

  @ApiProperty({
    description: 'Номер телефона',
    example: '+995591234567',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Номер телефона должен быть действительным',
  })
  phone?: string;

  @ApiProperty({
    description: 'ID роли пользователя',
    example: 3,
  })
  @IsNotEmpty()
  @IsNumber()
  role_id: number;
}