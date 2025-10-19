import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Статус регистрации',
    example: 'success',
  })
  status: string;

  @ApiProperty({
    description: 'Сообщение о результате регистрации',
    example: 'Пользователь успешно зарегистрирован. Пожалуйста, войдите в систему.',
  })
  message: string;

  @ApiProperty({
    description: 'Информация о созданном пользователе',
    example: {
      user_id: 'd5669069-0e13-4c97-a07d-381c12f37142',
      username: 'new_user',
      email: 'user@example.com',
      first_name: 'Имя',
      last_name: 'Фамилия',
      role: 'user',
      role_id: 3,
    },
  })
  user: {
    user_id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    role_id: number;
  };

  @ApiProperty({
    description: 'Время регистрации',
    example: '2025-10-19T20:15:30.000Z',
  })
  created_at: string;
}