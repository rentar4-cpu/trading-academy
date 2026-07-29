import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ShareEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  user_id?: number;

  @Column({ nullable: true })
  player_id?: number;

  @Column({ default: 'trading' })
  game_id: string;

  @Column({ default: 'result' })
  kind: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  payload_json: string;

  @CreateDateColumn()
  created_at: Date;
}
