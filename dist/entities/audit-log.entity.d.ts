export declare enum AuditOperation {
    INSERT = "INSERT",
    UPDATE = "UPDATE",
    DELETE = "DELETE"
}
export declare class AuditLog {
    audit_id: number;
    table_name: string;
    operation: AuditOperation;
    old_values: any;
    new_values: any;
    changed_by: string;
    changed_at: Date;
    record_id: string;
}
