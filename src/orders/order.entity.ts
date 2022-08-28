import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OrderState } from './order-state.enum';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  subject: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: OrderState })
  state: OrderState;

  @Column({ type: 'jsonb' })
  user: object;
}
