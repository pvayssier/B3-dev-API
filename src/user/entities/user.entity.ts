import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProjectUser } from '../../project-users/entities/project-user.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 256 })
  username: string;

  @Column({ type: 'varchar', length: 256 })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({
    type: 'enum',
    enum: ['Employee', 'Admin', 'ProjectManager'],
    default: 'Employee',
  })
  role: string;

  @OneToMany(() => ProjectUser, (projectUser) => projectUser.userId)
  projectUsers: ProjectUser[];
}
