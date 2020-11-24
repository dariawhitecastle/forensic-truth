import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, JoinColumn } from 'typeorm';
import { Submission } from './Submission';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column()
  answerGroup: number;

  @Column({ nullable: true })
  submissionId: number;

  @ManyToOne((type) => Submission, (submission) => submission.note)
  @JoinColumn({ name: "submissionId" })
  public submission: Submission;
}
