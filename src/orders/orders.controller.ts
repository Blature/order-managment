import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  createOrder(@Body() createOrder: CreateOrderDto): Promise<Order> {
    return this.ordersService.createOrder(createOrder);
  }

  @Patch('/:id')
  cancelOrder(@Param('id') id: string): Promise<void> {
    return this.ordersService.cancelOrder(id);
  }

  @Get('/:id')
  checkOrderState(@Param('id') id: string): Promise<string> {
    return this.ordersService.checkOrderState(id);
  }
}
