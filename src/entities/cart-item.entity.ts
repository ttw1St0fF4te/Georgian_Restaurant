import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { MenuItem } from './menu-item.entity';

@Entity('cart_items')
@Unique(['cart_id', 'item_id'])
export class CartItem {
  @PrimaryGeneratedColumn()
  cart_item_id: number;

  @Column('uuid')
  cart_id: string;

  @Column('int')
  item_id: number;

  @Column('int', { 
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseInt(value, 10),
    }
  })
  quantity: number;

  @CreateDateColumn({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP' 
  })
  added_at: Date;

  @UpdateDateColumn({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP' 
  })
  updated_at: Date;

  // Relationships
  @ManyToOne('Cart', 'items', { 
    onDelete: 'CASCADE',
    eager: false 
  })
  @JoinColumn({ name: 'cart_id' })
  cart: any;

  @ManyToOne(() => MenuItem, { eager: true })
  @JoinColumn({ name: 'item_id' })
  menuItem: MenuItem;
}