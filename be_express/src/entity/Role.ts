import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserDomainRole } from './UserDomainRole'

@Entity()
export class Role {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => UserDomainRole, userToRole => userToRole.role)
  public userDomainRoles!: UserDomainRole[];

}
