import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderState } from './order-state.enum';
import { Order } from './order.entity';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersRepository)
    private ordersRepository: OrdersRepository,
  ) {}
  private logger = new Logger('OrdersService');

  createOrder(createOrder: CreateOrderDto): Promise<Order> {
    return this.ordersRepository.createOrder(createOrder);
  }

  async cancelOrder(id: string): Promise<void> {
    const order = await this.ordersRepository.findOne(id);
    if (!order) {
      this.logger.error(
        `Something Went Wrong ! - Order With ID => ${id} Not Found`,
      );
      throw new NotFoundException(
        `Something Went Wrong ! - Order With ID => ${id} Not Found`,
      );
    }
    order.state = OrderState.CANCELLED;
    await this.ordersRepository.save(order);
  }

  async checkOrderState(id: string): Promise<string> {
    const order = await this.ordersRepository.findOne(id);
    if (!order) {
      this.logger.error(
        `Something Went Wrong ! - Order With ID => ${id} Not Found`,
      );
      throw new NotFoundException(
        `Something Went Wrong ! - Order With ID => ${id} Not Found`,
      );
    }
    return `Order With ID => ${order.id} and Subject => ${order.subject} has "${order.state}" State`;
  }
}
