import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type EconomicEventScope = 'global' | 'sector' | 'company';

@Entity()
export class EconomicEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: 'Economy' })
  category: string;

  @Column()
  scope: EconomicEventScope;

  @Column({ nullable: true })
  target_symbol?: string;

  @Column({ nullable: true })
  target_sector?: string;

  @Column({ type: 'numeric', precision: 7, scale: 4 })
  price_impact_percent: number;

  @Column({ type: 'jsonb', nullable: true })
  impact_profile?: Record<string, number>;

  @Column({ default: 1 })
  duration_ticks: number;

  @CreateDateColumn()
  created_at: Date;
}
