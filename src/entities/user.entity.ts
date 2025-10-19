import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash: string;

  @Column({ type: 'varchar', length: 50 })
  first_name: string;

  @Column({ type: 'varchar', length: 50 })
  last_name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'int', default: 3 })
  role_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_login: Date;

  // Relations
  @ManyToOne('UserRole', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'role_id' })
  role: any;

  @OneToMany('UserAddress', 'user')
  addresses: any[];

  @OneToMany('Order', 'user')
  orders: any[];

  @OneToMany('TableReservation', 'user')
  reservations: any[];

  @OneToMany('RestaurantReview', 'user')
  reviews: any[];
}