import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class EarlyAccessSignup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  display_name?: string;

  @Column({ nullable: true })
  referral_code?: string;

  @Column({ nullable: true })
  referred_by_code?: string;

  @Column({ default: 'coming-soon' })
  source: string;

  @Column({ default: 'en' })
  locale: string;

  @Column({ default: 'waiting' })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}
