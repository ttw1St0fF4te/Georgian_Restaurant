import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('user_addresses')
export class UserAddress {
  @PrimaryGeneratedColumn()
  address_id: number;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'varchar', length: 50, default: 'Грузия' })
  country: string;

  @Column({ type: 'varchar', length: 100, default: 'Тбилиси' })
  city: string;

  @Column({ type: 'text' })
  street_address: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne('User', 'addresses', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: any;
}