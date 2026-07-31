import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ default: 'Trader' })
  display_name: string;

  @Column({ default: 'en' })
  preferred_language: string;

  @Column({ default: 1 })
  account_level: number;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  lifetime_tokens_earned: number;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  lifetime_tokens_spent: number;

  @Column({ default: 0 })
  total_play_seconds: number;

  @Column({ default: 0 })
  activity_score: number;

  @Column()
  password_hash: string;

  @Column({ default: false })
  email_verified: boolean;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  account_tokens: number;

  @Column({ type: 'timestamp', nullable: true })
  last_daily_login_at?: Date;

  @Column({ default: 0 })
  login_streak: number;

  @Column({ type: 'varchar', nullable: true })
  email_verification_code?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  email_verification_sent_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  email_verified_at?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
