import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TesterFeedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  device?: string;

  @Column({ nullable: true })
  tested_version?: string;

  @Column({ type: 'text' })
  answers_json: string;

  @Column({ type: 'text', nullable: true })
  confusion_comment?: string;

  @Column({ type: 'text', nullable: true })
  interesting_feature?: string;

  @Column({ nullable: true })
  clarity_rating?: number;

  @Column({ type: 'text', nullable: true })
  first_improvement?: string;

  @Column({ type: 'text', nullable: true })
  additional_comments?: string;

  @Column({ default: 'web-checklist' })
  source: string;

  @CreateDateColumn()
  created_at: Date;
}
