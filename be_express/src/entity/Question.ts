import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Answer } from './Answer';
import { Section } from './Section';

@Entity()
export class Question {
  @PrimaryGeneratedColumn() id: number;

  @Column() description: string;

  @Column() type: string;

  @Column() order: number;

  @Column({ nullable: true }) width: number;

  @Column() required: boolean;

  @Column({ nullable: true })
  charLimit: number;

  @Column({ nullable: true })
  placeholder: string;

  @Column({ type: 'simple-array', nullable: true })
  subQuestions: number[];

  @Column({ type: 'simple-array', nullable: true })
  responseOptions: string[];

  @Column() externalUse: boolean;

  @ManyToOne((type) => Section, (section) => section.question)
  public section: Section;

  @OneToMany((type) => Answer, (answer) => answer.question)
  public answer: Answer[];
}
