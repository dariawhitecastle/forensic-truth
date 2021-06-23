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

  @Column({ nullable: true })
  body: string;

  @Column({ nullable: true })
  submissionId: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  position: string;

  @Column({ nullable: true })
  agency: string;

  @Column({ nullable: true })
  caseNumber: number;

  @Column({ nullable: true })
  date: string;

  @Column({ nullable: true })
  timeIn: string;

  @Column({ nullable: true })
  timeOut: string;

  @Column({ nullable: true })
  chartNum: number;

  @Column({ nullable: true })
  acquaintanceExam: number;

  @OneToOne(() => Submission, (submission) => submission.reportSection)
  @JoinColumn({ name: 'submissionId' })
  public submission: Submission;
}
