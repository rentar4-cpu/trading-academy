import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type MonetizationOfferType = 'starter_cash' | 'premium_credits' | 'cosmetic_badge';

@Entity()
export class MonetizationOffer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sku: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  type: MonetizationOfferType;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price_usd: number;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  cash_reward: number;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  premium_credit_reward: number;

  @Column({ default: true })
  is_active: boolean;
}
