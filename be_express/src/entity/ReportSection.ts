import {
  Entity,
  OneToOne,
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
  submissionId: number;

  @Column()
  name: string;

  @Column()
  position: string;

  @Column()
  agency: string;

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

  @Column()
  acquaintanceExam: number;

  @OneToOne(() => Submission, (submission) => submission.reportSection)
  @JoinColumn({ name: 'submissionId' })
  public submission: Submission;
}
