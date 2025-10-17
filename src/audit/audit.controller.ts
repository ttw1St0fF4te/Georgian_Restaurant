import { Controller, Get, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { AuditService, AuditLogFilter } from './audit.service';
import { AuditOperation } from '../entities/audit-log.entity';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
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