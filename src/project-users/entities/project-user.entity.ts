import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProjectUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  public endDate: Date;

  @Column({ type: 'uuid' })
  public projectId: string;

  @Column({ type: 'uuid' })
  public userId: string;
}
