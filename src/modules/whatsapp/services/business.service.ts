import { Injectable, Logger } from '@nestjs/common';
import { BusinessRepository } from '../repositories/business.repository';
import { Business } from '../entities/business.entity';

@Injectable()
export class BusinessService {
  private readonly logger = new Logger(BusinessService.name);
  constructor(private readonly repository: BusinessRepository) {}

  async findByPhoneNumberId(phoneNumberId: string): Promise<Business | null> {
    this.logger.debug(`Finding Business By Phone Number Id, ${phoneNumberId}`);
    return this.repository.findOneBy({ phoneNumberId });
  }
}
