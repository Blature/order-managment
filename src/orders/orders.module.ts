import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcGateway } from 'src/bc.gateway';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    BcGateway,
    TypeOrmModule.forFeature([OrdersRepository]),
    ClientsModule.register([
      {
        name: 'PAYMENT',
        transport: Transport.TCP,
        options: { port: 3020 },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, BcGateway],
})
export class OrdersModule {}
