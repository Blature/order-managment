import { OrderState } from 'src/orders/order-state.enum';
import { Order } from 'src/orders/order.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  state: OrderState;

  @OneToOne((_type) => Order, (order) => order.id)
  order: Order;
}
