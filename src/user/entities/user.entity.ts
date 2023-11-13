import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
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
}
