import { ApiProperty } from '@nestjs/swagger';

export class AuditLogDto {
  @ApiProperty({
    description: 'ID записи аудита',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  log_id: string;

  @ApiProperty({
    description: 'Название таблицы',
    example: 'users',
  })
  table_name: string;

  @ApiProperty({
    description: 'ID записи в таблице',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  record_id: string;

  @ApiProperty({
    description: 'Операция (INSERT, UPDATE, DELETE)',
    example: 'UPDATE',
  })
  operation: string;

  @ApiProperty({
    description: 'Старые значения (JSONB)',
    example: { name: 'Старое имя', email: 'old@example.com' },
    required: false,
  })
  old_values?: any;

  @ApiProperty({
    description: 'Новые значения (JSONB)',
    example: { name: 'Новое имя', email: 'new@example.com' },
    required: false,
  })
  new_values?: any;

  @ApiProperty({
    description: 'Время операции',
    example: '2024-01-15T10:30:45.123Z',
  })
  timestamp: string;
}