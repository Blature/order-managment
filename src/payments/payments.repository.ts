import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderState } from 'src/orders/order-state.enum';
import { OrdersRepository } from 'src/orders/orders.repository';
import { EntityRepository, Repository } from 'typeorm';
import { Payment } from './payment.entity';

@EntityRepository(Payment)
export class PaymentsRepository extends Repository<Payment> {
  @InjectRepository(OrdersRepository)
  private ordersRepository: OrdersRepository;
  private logger = new Logger('PaymentsRepository');

  async checkOrderState(id: string): Promise<string> {
    const order = this.ordersRepository.findOne({ id });
    console.log(order);
    const state = (await order).state;
    if (state === OrderState.CREATED) {
      const payment = this.create({
        state: OrderState.CANCELLED,
      });
      await this.save(payment);
      return (await order).state;
    } else {
      this.logger.error('error');
    }
  }
}
