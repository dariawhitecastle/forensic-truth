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
}
