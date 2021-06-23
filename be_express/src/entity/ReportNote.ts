import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
} from 'typeorm';
import { Submission } from './Submission';

@Entity()
export class ReportNote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  body: string;

  @Column()
  questionId: number;

  @Column({ nullable: true })
  submissionId: number;

  @ManyToOne((type) => Submission, (submission) => submission.reportNote)
  @JoinColumn({ name: 'submissionId' })
  public submission: Submission;
}
