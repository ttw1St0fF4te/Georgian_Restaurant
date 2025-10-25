export declare class AuditLogDto {
    log_id: string;
    table_name: string;
    record_id: string;
    operation: string;
    old_values?: any;
    new_values?: any;
    timestamp: string;
}
