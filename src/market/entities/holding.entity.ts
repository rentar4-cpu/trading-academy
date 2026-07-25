import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['player_id', 'company_id'])
export class Holding {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  player_id: number;

  @Column()
  company_id: number;

  @Column({ type: 'numeric', precision: 14, scale: 4, default: 0 })
  quantity: number;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  average_cost: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
