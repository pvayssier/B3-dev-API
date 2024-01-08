import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({
    type: 'enum',
    enum: ['Pending', 'Accepted', 'Declined'],
    default: 'Pending',
  })
  eventStatus: string;

  @Column({ type: 'enum', enum: ['RemoteWork', 'PaidLeave'] })
  eventType: string;

  @Column({ type: 'varchar', length: 256, default: '' })
  eventDescription: string;

  @Column()
  userId!: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;
}
