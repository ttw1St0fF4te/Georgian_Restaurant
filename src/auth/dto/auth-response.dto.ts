import { ApiProperty } from '@nestjs/swagger';

export class JwtPayload {
  sub: string; // user_id
  username: string;
  email: string;
  role: string;
  role_id: number;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'User information',
    example: {
      user_id: 'uuid-here',
      username: 'admin',
      email: 'admin@georgian-restaurant.ge',
      first_name: 'Тенгиз',
      last_name: 'Админидзе',
      role: 'admin',
      role_id: 1,
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
}