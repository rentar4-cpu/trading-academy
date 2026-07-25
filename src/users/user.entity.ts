import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ default: 'Trader' })
  display_name: string;

  @Column()
  password_hash: string;

  @Column({ default: false })
  email_verified: boolean;

  @Column({ type: 'varchar', nullable: true })
  email_verification_code?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  email_verification_sent_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  email_verified_at?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
