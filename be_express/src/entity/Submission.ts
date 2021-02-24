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
import { ReportSection } from './ReportSection';

@Entity()
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true }) caseId: number;

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

  @OneToMany(() => ReportSection, (reportSection) => reportSection.submission, {
    eager: true,
    cascade: true,
  })
  public reportSection: ReportSection[];
}
