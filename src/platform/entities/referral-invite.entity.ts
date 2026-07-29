import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ReferralInvite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  inviter_user_id?: number;

  @Column({ nullable: true })
  inviter_email?: string;

  @Column({ unique: true })
  code: string;

  @Column({ default: 0 })
  uses: number;

  @Column({ default: 25 })
  max_uses: number;

  @Column({ default: 100 })
  reward_tokens: number;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}
