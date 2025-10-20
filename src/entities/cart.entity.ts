import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  cart_id: string;

  @Column('uuid', { unique: true })
  user_id: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP' 
  })
  updated_at: Date;

  // Relationships
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany('CartItem', 'cart', { 
    cascade: true,
    eager: false 
  })
  items: any[];
}