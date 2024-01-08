import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/projects.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class ProjectUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column()
  projectId: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Project, (project) => project.id)
  @JoinColumn({ name: 'projectId' })
  project: Project;
}
