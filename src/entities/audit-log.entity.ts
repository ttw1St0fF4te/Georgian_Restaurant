import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum AuditOperation {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

@Entity('audit_log')
export class AuditLog {
  @PrimaryGeneratedColumn()
  audit_id: number;

  @Column({ type: 'varchar', length: 100 })
  table_name: string;

  @Column({
    type: 'enum',
    enum: AuditOperation
  })
  operation: AuditOperation;

  @Column({ type: 'jsonb', nullable: true })
  old_values: any;

  @Column({ type: 'jsonb', nullable: true })
  new_values: any;

  @Column({ type: 'varchar', length: 100 })
  changed_by: string;

  @CreateDateColumn()
  changed_at: Date;

  @Column({ type: 'text', nullable: true })
  record_id: string;
}