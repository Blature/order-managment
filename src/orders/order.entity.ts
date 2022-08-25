import { User } from 'src/auth/user.entity';
import { Payment } from 'src/payments/payment.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderState } from './order-state.enum';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  subject: string;

  @Column()
  description: string;

  @Column()
  state: OrderState;

  @ManyToOne((_type) => User, (user) => user.orders, { eager: false })
  user: User;

  @OneToOne((_type) => Payment, (payment) => payment.order)
  payment: Payment;
}
