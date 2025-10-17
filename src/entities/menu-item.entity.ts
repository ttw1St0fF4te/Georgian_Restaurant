import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn()
  item_id: number;

  @Column({ type: 'varchar', length: 150 })
  item_name: string;

  @Column({ type: 'text', nullable: true })
  item_description: string;

  @Column({ type: 'int' })
  category_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  cooking_time_minutes: number;

  @Column({ type: 'int', nullable: true })
  calories: number;

  @Column({ type: 'boolean', default: false })
  is_vegetarian: boolean;

  @Column({ type: 'boolean', default: false })
  is_spicy: boolean;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  @Column({ type: 'text', nullable: true })
  image_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne('MenuCategory', 'menu_items', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: any;

  @OneToMany('OrderItem', 'menu_item')
  order_items: any[];
}