import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@Entity('user_roles')
export class UserRole {
  @PrimaryGeneratedColumn()
  role_id: number;

  @Column({ 
    type: 'varchar', 
    length: 50, 
    unique: true,
    enum: ['admin', 'manager', 'user', 'guest']
  })
  role_name: string;

  @Column({ type: 'text', nullable: true })
  role_description: string;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @OneToMany('User', 'role')
  users: any[];
}