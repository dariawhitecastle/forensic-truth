import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, OneToMany } from "typeorm";
import { Answer } from './Answer'
// import { Question } from './Question'
// import { Section } from "./Section";
import { User } from './User'

@Entity()
export class Submission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column() caseId: number;

    @ManyToOne(type => User, user => user.submission)
    public user: User;

    @ManyToOne(type => Answer, answer => answer.submission)
    public answer: Answer[];
}