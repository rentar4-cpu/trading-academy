import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  player_id: number;

  @Column()
  offer_id: number;

  @Column()
  sku: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price_usd: number;

  @Column({ default: 'simulated' })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}
