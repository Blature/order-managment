import { Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Order } from './order.entity';

@EntityRepository(Order)
export class OrdersRepository extends Repository<Order> {
  private logger = new Logger('OrdersRepository');
}
