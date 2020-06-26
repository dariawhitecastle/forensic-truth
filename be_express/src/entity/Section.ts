import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, OneToMany } from "typeorm";
import { Application } from './Application'
import { Question } from './Question'

@Entity()
export class Section{

  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;    

  @ManyToOne(type => Application, application => application.section)
  public application: Application;

  @OneToMany(type => Question, question => question.section)
  public question!: Question[]

}
