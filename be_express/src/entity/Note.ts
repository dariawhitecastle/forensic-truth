import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Answer } from "./Answer";

@Entity()
export class Note { 
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    body: string;

}