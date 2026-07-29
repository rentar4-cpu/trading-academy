import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserGameProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  game_id: string;

  @Column({ default: false })
  installed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  installed_at?: Date;

  @Column({ default: 0 })
  play_seconds: number;

  @Column({ default: 0 })
  sessions_played: number;

  @Column({ default: 0 })
  wins: number;

  @Column({ default: 0 })
  losses: number;

  @Column({ default: 0 })
  draws: number;

  @Column({ default: 0 })
  activity_score: number;

  @Column({ default: '{}' })
  settings_json: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
