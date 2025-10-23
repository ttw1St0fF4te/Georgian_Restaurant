import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

export enum OrderType {
  DELIVERY = 'delivery',
  DINE_IN = 'dine_in',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  order_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({
    type: 'enum',
    enum: OrderType
  })
  order_type: OrderType;

  // Поля для доставки
  @Column({ type: 'varchar', length: 50, nullable: true })
  delivery_country: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  delivery_city: string;

  @Column({ type: 'text', nullable: true })
  delivery_street_address: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  delivery_phone: string;

  // Для ресторана (через бронь)
  @Column({ type: 'uuid', nullable: true })
  reservation_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  delivery_fee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne('User', 'orders', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: any;

  @ManyToOne('TableReservation', 'orders', { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'reservation_id' })
  reservation: any;

  @OneToMany('OrderItem', 'order')
  order_items: any[];
}