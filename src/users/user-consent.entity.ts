import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserConsent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  document_type: string;

  @Column()
  document_version: string;

  @Column({ default: 'en' })
  locale: string;

  @Column({ default: 'account-registration' })
  source: string;

  @CreateDateColumn()
  accepted_at: Date;
}
