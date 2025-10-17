import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

export enum ReservationStatus {
  UNCONFIRMED = 'unconfirmed',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('table_reservations')
export class TableReservation {
  @PrimaryGeneratedColumn('uuid')
  reservation_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'int' })
  restaurant_id: number;

  @Column({ type: 'int' })
  table_id: number;

  @Column({ type: 'date' })
  reservation_date: Date;

  @Column({ type: 'time' })
  reservation_time: string;

  @Column({ type: 'int', default: 2 })
  duration_hours: number;

  @Column({ type: 'int' })
  guests_count: number;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.UNCONFIRMED
  })
  reservation_status: ReservationStatus;

  @Column({ type: 'varchar', length: 20 })
  contact_phone: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  confirmed_at: Date;

  // Relations
  @ManyToOne('User', 'reservations', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: any;

  @ManyToOne('Restaurant', 'reservations', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: any;

  @ManyToOne('Table', 'reservations', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'table_id' })
  table: any;

  @OneToMany('Order', 'reservation')
  orders: any[];
}