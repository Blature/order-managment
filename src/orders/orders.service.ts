import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderState } from './order-state.enum';
import { Order } from './order.entity';
import { OrdersRepository } from './orders.repository';
import { userData } from './user-mock-data.object';
import { setTimeout } from 'timers/promises';
import { BcGateway } from '../bc.gateway';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersRepository)
    private ordersRepository: OrdersRepository,
    @Inject('PAYMENT')
    private communicationPayment: ClientProxy,
    private bcGateway: BcGateway,
  ) {}
  private logger = new Logger('OrdersService');
  private event = new Logger('EventHandler');

  async createOrder(createOrder: CreateOrderDto): Promise<Order> {
    const { subject, description } = createOrder;

    const order = this.ordersRepository.create({
      subject,
      description,
      state: OrderState.CREATED,
      user: userData,
    });

    try {
      await this.ordersRepository.save(order);
      this.bcGateway.handleMessage(order);
      const newOrderList = [order.id, order.state];
      this.communicationPayment.emit('order_state_send', newOrderList);
      this.logger.verbose(
        `Order with subject => ${JSON.stringify(order.subject)} created!`,
      );
    } catch (err) {
      this.logger.error(`Something Went Wrong! (Error => ${err.message})`);
      throw new Error(`Something Went Wrong !`);
    }
    return order;
  }

  async cancelOrder(id: string): Promise<void> {
    const order = await this.ordersRepository.findOne({ id });
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
    const order = await this.ordersRepository.findOne({ id });
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

  async handleOrderState(data) {
    const id = data[0];
    const order = await this.ordersRepository.findOne(id);
    order.state = data[1];
    try {
      await this.ordersRepository.save(order);
      this.bcGateway.handleMessage(order);
      this.event.verbose(
        `Order with ID => ${data[0]} State Changed to => "${data[1]}"`,
      );
    } catch (err) {
      this.event.error(`Something Went Wrong ! - Error => ${err.message}`);
    }

    if (data[1] === 'Confirmed') {
      order.state = OrderState.DELIVERED;
      await setTimeout(10000);
      await this.ordersRepository.save(order);
      this.bcGateway.handleMessage(order);
      this.event.verbose(
        `Order with ID => ${data[0]} State Changed to => "Delivered"`,
      );
    }
  }
}
