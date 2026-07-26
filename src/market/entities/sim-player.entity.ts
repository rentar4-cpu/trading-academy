import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class SimPlayer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  user_id?: number;

  @Column()
  display_name: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 10000 })
  cash_balance: number;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  premium_credits: number;

  @Column({ default: 0 })
  ad_reward_claims: number;

  @Column({ default: 'ready' })
  first_session_status: string;

  @Column({ type: 'timestamp', nullable: true })
  first_session_started_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  first_session_completed_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  first_session_second_trade_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  first_session_returned_at?: Date;

  @Column({ default: 0 })
  first_session_trade_count: number;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  first_session_reward_tokens: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
