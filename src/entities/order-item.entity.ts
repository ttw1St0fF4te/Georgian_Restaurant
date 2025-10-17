import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  order_item_id: number;

  @Column({ type: 'uuid' })
  order_id: string;

  @Column({ type: 'int' })
  item_id: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number;

  // Relations
  @ManyToOne('Order', 'order_items', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: any;

  @ManyToOne('MenuItem', 'order_items', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  menu_item: any;
}