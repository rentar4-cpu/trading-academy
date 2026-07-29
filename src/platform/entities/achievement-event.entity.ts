import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AchievementEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ default: 'global' })
  scope: string;

  @Column({ default: 'global' })
  game_id: string;

  @Column()
  code: string;

  @Column()
  title: string;

  @CreateDateColumn()
  created_at: Date;
}
