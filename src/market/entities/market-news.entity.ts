import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MarketNews {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  summary: string;

  @Column()
  category: string;

  @Column({ nullable: true })
  target_sector?: string;

  @Column({ nullable: true })
  target_symbol?: string;

  @Column({ type: 'numeric', precision: 7, scale: 4 })
  expected_impact_percent: number;

  @Column({ type: 'numeric', precision: 6, scale: 2 })
  probability_percent: number;

  @Column()
  severity: string;

  @Column({ default: 'scheduled' })
  status: string;

  @Column()
  scheduled_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
