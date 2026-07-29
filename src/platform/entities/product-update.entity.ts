import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ProductUpdate {
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
  highlights_json: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;
}
