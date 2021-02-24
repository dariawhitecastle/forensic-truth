import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
} from 'typeorm';
import { Submission } from './Submission';

@Entity()
export class ReportSection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column()
  questionId: number;

  @Column()
  submissionId: number;

  @ManyToOne(() => Submission, (submission) => submission.reportSection)
  @JoinColumn({ name: 'submissionId' })
  public submission: Submission;
}
