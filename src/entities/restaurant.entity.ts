import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

export interface WorkingHours {
  [key: string]: string; // monday: "10:00-22:00", tuesday: "10:00-22:00", etc.
}

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn()
  restaurant_id: number;

  @Column({ type: 'varchar', length: 100 })
  restaurant_name: string;

  @Column({ type: 'text', nullable: true })
  restaurant_description: string;

  @Column({ type: 'varchar', length: 50, default: 'Грузия' })
  country: string;

  @Column({ type: 'varchar', length: 100, default: 'Тбилиси' })
  city: string;

  @Column({ type: 'text' })
  street_address: string;

  @Column({ type: 'jsonb', nullable: true })
  working_hours: WorkingHours;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.00 })
  rating: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany('Table', 'restaurant')
  tables: any[];

  @OneToMany('TableReservation', 'restaurant')
  reservations: any[];

  @OneToMany('RestaurantReview', 'restaurant')
  reviews: any[];
}