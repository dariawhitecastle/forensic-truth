import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Question } from './Question';
import { Note } from './Note';
import { Submission } from './Submission';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn() id: number;

  @Column() body: string;

  @Column() responseSelection: string;

  @ManyToOne((type) => Submission, (submission) => submission.answer)
  public submission: Submission;

  @ManyToOne((type) => Question, (question) => question.answer)
  public question: Question;

  @OneToOne((type) => Note)
  @JoinColumn()
  public note: Note;
}
