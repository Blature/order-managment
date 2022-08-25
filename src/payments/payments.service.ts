import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentsRepository } from './payments.repository';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentsRepository)
    private paymentsRepository: PaymentsRepository,
  ) {}
  private logger = new Logger('PaymentsService');

  checkOrderState(id: string): Promise<string> {
    return this.paymentsRepository.checkOrderState(id);
  }
}
