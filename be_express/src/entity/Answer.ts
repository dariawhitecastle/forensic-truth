import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Question } from './Question';
import { Submission } from './Submission';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn() id: number;

  @Column() body: string;

  @Column() responseSelection: string;

  @ManyToOne((type) => Submission, (submission) => submission.answer)
  public submission: Submission;

  @ManyToOne((type) => Question, (question) => question.answer, {
    eager: true,
  })
  public question: Question;
}
