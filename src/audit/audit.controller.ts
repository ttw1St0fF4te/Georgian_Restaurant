import { Controller, Get, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuditService, AuditLogFilter } from './audit.service';
import { AuditOperation } from '../entities/audit-log.entity';

@ApiTags('audit')
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Получить записи аудита с фильтрацией',
    description: 'Возвращает записи аудита с возможностью фильтрации по таблице, операции, пользователю и ID записи'
  })
  @ApiQuery({ name: 'table', required: false, description: 'Имя таблицы для фильтрации' })
  @ApiQuery({ name: 'operation', required: false, enum: AuditOperation, description: 'Тип операции (INSERT, UPDATE, DELETE)' })
  @ApiQuery({ name: 'user', required: false, description: 'Пользователь, выполнивший операцию' })
  @ApiQuery({ name: 'recordId', required: false, description: 'ID измененной записи' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Лимит записей (по умолчанию 50)' })
  @ApiResponse({ status: 200, description: 'Записи аудита успешно получены' })
  async getAuditLogs(
    @Query('table') tableName?: string,
    @Query('operation') operation?: AuditOperation,
    @Query('user') changedBy?: string,
    @Query('recordId') recordId?: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
  ) {
    const filter: AuditLogFilter = {
      tableName,
      operation,
      changedBy,
      recordId,
      limit,
    };

    // Удаляем undefined значения
    Object.keys(filter).forEach(key => 
      filter[key] === undefined && delete filter[key]
    );

    return this.auditService.getAuditLogs(filter);
  }

  @Get('recent')
  @ApiOperation({ 
    summary: 'Получить последние записи аудита',
    description: 'Возвращает последние записи аудита в порядке убывания по времени'
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Количество записей (по умолчанию 50)' })
  @ApiResponse({ status: 200, description: 'Последние записи аудита получены' })
  async getRecentAuditLogs(
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.auditService.getRecentAuditLogs(limit);
  }

  @Get('history')
  async getRecordHistory(
    @Query('table') tableName: string,
    @Query('recordId') recordId: string,
  ) {
    if (!tableName || !recordId) {
      throw new Error('Table name and record ID are required');
    }
    
    return this.auditService.getRecordHistory(tableName, recordId);
  }

  @Get('statistics')
  @ApiOperation({ 
    summary: 'Получить статистику аудита',
    description: 'Возвращает статистику операций аудита по таблицам и типам операций'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Статистика аудита получена',
    schema: {
      type: 'object',
      properties: {
        operationStats: { type: 'array', description: 'Статистика по операциям' },
        tableStats: { type: 'array', description: 'Статистика по таблицам' }
      }
    }
  })
  async getStatistics() {
    return this.auditService.getAuditStatistics();
  }

  @Get('recent-changes')
  async getRecentChanges(
    @Query('days', new DefaultValuePipe(7), ParseIntPipe) days: number,
  ) {
    return this.auditService.getRecentChanges(days);
  }

  @Get('user-activity')
  async getUserActivity(
    @Query('username') username: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    if (!username) {
      throw new Error('Username is required');
    }
    
    return this.auditService.getUserActivity(username, limit);
  }
}