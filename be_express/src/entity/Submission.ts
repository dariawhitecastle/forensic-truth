import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Answer } from './Answer';
import { User } from './User';
import { Note } from './Note';

@Entity()
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() caseId: number;

  @Column()
  date: string;

  @ManyToOne((type) => User, (user) => user.submission)
  public user: User;

  @OneToMany((type) => Answer, (answer) => answer.submission, {
    eager: true,
    cascade: true,
  })
  public answer: Answer[];

  @OneToMany((type) => Note, (note) => note.submission, {
    eager: true,
    cascade: true,
  })
  public note: Note[];
}
