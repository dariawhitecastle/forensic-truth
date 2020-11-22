import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Submission } from './Submission';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column()
  answerGroup: number;

  @ManyToOne((type) => Submission, (submission) => submission.note)
  public submission: Submission;
}
