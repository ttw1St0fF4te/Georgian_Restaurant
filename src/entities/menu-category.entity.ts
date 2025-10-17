import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('menu_categories')
export class MenuCategory {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  category_name: string;

  @Column({ type: 'text', nullable: true })
  category_description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany('MenuItem', 'category')
  menu_items: any[];
}