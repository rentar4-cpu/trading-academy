import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class DevLogEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  version: string;

  @Column()
  title: string;

  @Column()
  summary: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ default: '[]' })
  tags_json: string;

  @Column({ default: true })
  is_published: boolean;

  @Column({ type: 'timestamp', nullable: true })
  published_at?: Date;

  @CreateDateColumn()
  created_at: Date;
}
