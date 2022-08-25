import { Controller, Get, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get('/:id')
  checkOrderState(@Param('id') id: string): Promise<string> {
    return this.paymentsService.checkOrderState(id);
  }
}
