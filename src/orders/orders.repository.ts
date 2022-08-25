import { Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderState } from './order-state.enum';
import { Order } from './order.entity';

@EntityRepository(Order)
export class OrdersRepository extends Repository<Order> {
  private logger = new Logger('OrdersRepository');

  async createOrder(createOrder: CreateOrderDto): Promise<Order> {
    const { subject, description } = createOrder;

    const order = this.create({
      subject,
      description,
      state: OrderState.CREATED,
    });

    try {
      await this.save(order);
      this.logger.verbose(
        `Order with subject => ${JSON.stringify(order.subject)} created!`,
      );
    } catch (err) {
      this.logger.error(`Something Went Wrong! (Error => ${err.message})`);
      throw new Error(`Something Went Wrong !`);
    }
    return order;
  }
}
