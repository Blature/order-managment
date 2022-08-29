import { Test } from '@nestjs/testing';
import { BcGateway } from '../../bc.gateway';
import { OrdersController } from '../orders.controller';
import { OrdersService } from '../orders.service';

const testOrder = 'New Burger';
const testDes = 'Burger';

describe('OrdersController', () => {
  let ordersController: OrdersController;
  let ordersService: OrdersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        OrdersService,
        BcGateway,
        {
          provide: OrdersService,
          useValue: {
            checkOrderState: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                subject: testOrder,
                description: testDes,
                state: 'Created',
                id,
              }),
            ),
          },
        },
      ],
    }).compile();

    ordersService = moduleRef.get<OrdersService>(OrdersService);
    ordersController = moduleRef.get<OrdersController>(OrdersController);
  });

  describe('checkOrderState', () => {
    it('get id and should return a state', async () => {
      await expect(ordersController.checkOrderState('id')).resolves.toEqual({
        subject: testOrder,
        description: testDes,
        state: 'Created',
        id: 'id',
      });
      await expect(
        ordersController.checkOrderState('another id'),
      ).resolves.toEqual({
        subject: testOrder,
        description: testDes,
        state: 'Created',
        id: 'another id',
      });
    });
  });
});
