import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class SimCompany {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  symbol: string;

  @Column()
  name: string;

  @Column()
  sector: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ default: '' })
  owner_name: string;

  @Column({ default: 0 })
  employee_count: number;

  @Column({ default: 2020 })
  founded_year: number;

  @Column({ default: 'none' })
  government_support_type: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  government_support_amount: number;

  @Column({ type: 'numeric', precision: 6, scale: 2, default: 0 })
  tax_benefit_percent: number;

  @Column({ type: 'numeric', precision: 6, scale: 2, default: 0 })
  state_loan_rate_percent: number;

  @Column({ default: 0 })
  support_expires_year: number;

  @Column({ default: 'none' })
  support_risk_level: string;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  price: number;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  previous_price: number;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  market_cap: number;

  @Column({ type: 'numeric', precision: 6, scale: 2, default: 0 })
  volatility: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
