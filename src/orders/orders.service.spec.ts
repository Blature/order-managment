import { Test } from '@nestjs/testing';
import { BcGateway } from '../bc.gateway';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';

const mockOrdersRepository = () => ({});

const mockOrder = {
  id: 'someid',
  subject: 'subject',
  description: 'description',
  state: 'Created',
  user: {},
};

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let ordersRepository: OrdersRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: OrdersRepository,
          useFactory: mockOrdersRepository,
        },
      ],
    }).compile();

    ordersService = module.get(OrdersService);
    ordersRepository = module.get(OrdersRepository);
  });

  describe('checkOrderState', () => {
    it('get id and calls ordersRepository to find order then returns result', async () => {
      expect(ordersRepository).not.toHaveBeenCalled();
      ordersService.checkOrderState('someid');
    });
  });
});
