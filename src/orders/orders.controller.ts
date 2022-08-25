import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(AuthGuard())
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  createOrder(
    @Body() createOrder: CreateOrderDto,
    @GetUser() user: User,
  ): Promise<Order> {
    return this.ordersService.createOrder(createOrder, user);
  }

  @Patch('/:id')
  cancelOrder(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.ordersService.cancelOrder(id, user);
  }

  @Get('/:id')
  checkOrderState(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<string> {
    return this.ordersService.checkOrderState(id, user);
  }
}
