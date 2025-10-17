import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('restaurant_reviews')
export class RestaurantReview {
  @PrimaryGeneratedColumn('uuid')
  review_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'int' })
  restaurant_id: number;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  review_text: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne('User', 'reviews', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: any;

  @ManyToOne('Restaurant', 'reviews', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: any;
}