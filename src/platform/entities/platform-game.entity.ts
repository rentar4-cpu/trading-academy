import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PlatformGame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  game_id: string;

  @Column()
  name: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ default: 0 })
  sort_order: number;

  @Column({ default: true })
  shared_auth: boolean;

  @Column({ default: true })
  shared_wallet: boolean;

  @Column({ default: true })
  shared_store: boolean;

  @Column({ default: true })
  shared_notifications: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
