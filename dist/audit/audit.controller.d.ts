import { AuditService } from './audit.service';
import { AuditOperation } from '../entities/audit-log.entity';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    getAuditLogs(tableName?: string, operation?: AuditOperation, changedBy?: string, recordId?: string, limit?: number): Promise<import("../entities/audit-log.entity").AuditLog[]>;
    getRecentAuditLogs(limit: number): Promise<import("../entities/audit-log.entity").AuditLog[]>;
    getRecordHistory(tableName: string, recordId: string): Promise<import("../entities/audit-log.entity").AuditLog[]>;
    getStatistics(): Promise<any>;
    getRecentChanges(days: number): Promise<import("../entities/audit-log.entity").AuditLog[]>;
    getUserActivity(username: string, limit: number): Promise<import("../entities/audit-log.entity").AuditLog[]>;
}
