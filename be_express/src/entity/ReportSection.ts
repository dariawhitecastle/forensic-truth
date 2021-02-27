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

  @Column()
  name: string;

  @Column()
  position: string;

  @Column()
  caseNumber: number;

  @Column()
  date: Date;

  @Column()
  timeIn: string;

  @Column()
  timeOut: string;

  @Column()
  chartNum: number;

  @ManyToOne(() => Submission, (submission) => submission.reportSection)
  @JoinColumn({ name: 'submissionId' })
  public submission: Submission;
}
