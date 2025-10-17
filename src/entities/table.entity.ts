import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('tables')
export class Table {
  @PrimaryGeneratedColumn()
  table_id: number;

  @Column({ type: 'int' })
  restaurant_id: number;

  @Column({ type: 'int' })
  table_number: number;

  @Column({ type: 'int' })
  seats_count: number;

  @Column({ type: 'boolean', default: true })
  is_available: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne('Restaurant', 'tables', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: any;

  @OneToMany('TableReservation', 'table')
  reservations: any[];
}