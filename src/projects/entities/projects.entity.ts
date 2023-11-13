import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Projects {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 256 })
  name: string;

  @Column({ type: 'varchar', length: 256 })
  referringEmployeeId: string;
}
