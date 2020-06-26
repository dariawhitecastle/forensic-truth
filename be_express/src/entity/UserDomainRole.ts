import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from './User'
import { Role } from './Role'

@Entity()
export class UserDomainRole {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  emailAddress: string;

  @ManyToOne(type => User, user => user.userDomainRoles)
  public user!: User;

  @ManyToOne(type => Role, role => role.userDomainRoles)
  public role!: Role;

}
