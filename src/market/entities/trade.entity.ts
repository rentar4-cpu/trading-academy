import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type TradeSide = 'buy' | 'sell';

@Entity()
export class Trade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  player_id: number;

  @Column()
  company_id: number;

  @Column()
  symbol: string;

  @Column()
  side: TradeSide;

  @Column({ type: 'numeric', precision: 14, scale: 4 })
  quantity: number;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  execution_price: number;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  gross_value: number;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  fee: number;

  @CreateDateColumn()
  created_at: Date;
}
