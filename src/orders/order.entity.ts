import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OrderState } from './order-state.enum';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  subject: string;

  @Column()
  description: string;

  @Column()
  state: OrderState;
}
