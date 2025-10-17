import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog, AuditOperation } from '../entities/audit-log.entity';

export interface AuditLogFilter {
  tableName?: string;
  operation?: AuditOperation;
  changedBy?: string;
  recordId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

  /**
   * Получить последние записи аудита
   */
  async getRecentAuditLogs(limit: number = 50): Promise<AuditLog[]> {
    return this.auditRepository.find({
      order: { changed_at: 'DESC' },
      take: limit,
    });
  }

  /**
   * Получить записи аудита с фильтрацией
   */
  async getAuditLogs(filter: AuditLogFilter): Promise<AuditLog[]> {
    const queryBuilder = this.auditRepository.createQueryBuilder('audit');

    if (filter.tableName) {
      queryBuilder.andWhere('audit.table_name = :tableName', { 
        tableName: filter.tableName 
      });
    }

    if (filter.operation) {
      queryBuilder.andWhere('audit.operation = :operation', { 
        operation: filter.operation 
      });
    }

    if (filter.changedBy) {
      queryBuilder.andWhere('audit.changed_by = :changedBy', { 
        changedBy: filter.changedBy 
      });
    }

    if (filter.recordId) {
      queryBuilder.andWhere('audit.record_id = :recordId', { 
        recordId: filter.recordId 
      });
    }

    if (filter.dateFrom) {
      queryBuilder.andWhere('audit.changed_at >= :dateFrom', { 
        dateFrom: filter.dateFrom 
      });
    }

    if (filter.dateTo) {
      queryBuilder.andWhere('audit.changed_at <= :dateTo', { 
        dateTo: filter.dateTo 
      });
    }

    queryBuilder.orderBy('audit.changed_at', 'DESC');

    if (filter.limit) {
      queryBuilder.take(filter.limit);
    }

    return queryBuilder.getMany();
  }

  /**
   * Получить историю изменений конкретной записи
   */
  async getRecordHistory(tableName: string, recordId: string): Promise<AuditLog[]> {
    return this.auditRepository.find({
      where: {
        table_name: tableName,
        record_id: recordId,
      },
      order: { changed_at: 'ASC' },
    });
  }

  /**
   * Получить статистику аудита
   */
  async getAuditStatistics(): Promise<any> {
    const stats = await this.auditRepository
      .createQueryBuilder('audit')
      .select([
        'audit.table_name',
        'audit.operation',
        'COUNT(*) as count'
      ])
      .groupBy('audit.table_name, audit.operation')
      .getRawMany();

    const tableStats = await this.auditRepository
      .createQueryBuilder('audit')
      .select([
        'audit.table_name',
        'COUNT(*) as total_operations',
        'COUNT(CASE WHEN audit.operation = \'INSERT\' THEN 1 END) as inserts',
        'COUNT(CASE WHEN audit.operation = \'UPDATE\' THEN 1 END) as updates',
        'COUNT(CASE WHEN audit.operation = \'DELETE\' THEN 1 END) as deletes'
      ])
      .groupBy('audit.table_name')
      .getRawMany();

    return {
      operationStats: stats,
      tableStats: tableStats,
    };
  }

  /**
   * Получить изменения за последние N дней
   */
  async getRecentChanges(days: number = 7): Promise<AuditLog[]> {
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    return this.getAuditLogs({ 
      dateFrom, 
      limit: 100 
    });
  }

  /**
   * Поиск изменений по пользователю
   */
  async getUserActivity(username: string, limit: number = 50): Promise<AuditLog[]> {
    return this.getAuditLogs({
      changedBy: username,
      limit,
    });
  }
}