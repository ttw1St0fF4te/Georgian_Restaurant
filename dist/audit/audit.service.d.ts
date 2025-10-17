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
export declare class AuditService {
    private readonly auditRepository;
    constructor(auditRepository: Repository<AuditLog>);
    getRecentAuditLogs(limit?: number): Promise<AuditLog[]>;
    getAuditLogs(filter: AuditLogFilter): Promise<AuditLog[]>;
    getRecordHistory(tableName: string, recordId: string): Promise<AuditLog[]>;
    getAuditStatistics(): Promise<any>;
    getRecentChanges(days?: number): Promise<AuditLog[]>;
    getUserActivity(username: string, limit?: number): Promise<AuditLog[]>;
}
