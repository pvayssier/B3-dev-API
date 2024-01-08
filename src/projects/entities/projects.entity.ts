import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ProjectUser } from '../../project-users/entities/project-user.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  referringEmployeeId: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'referringEmployeeId' })
  referringEmployee: User;

  @ManyToMany(() => ProjectUser, (projectUser) => projectUser.projectId)
  projectUsers: ProjectUser[];
}
