import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { RouterService } from './router.service';
import { ChangeValue, WhatsappIncomingPayload } from '../types/whatsapp';
import { Business } from '../entities/business.entity';
import { ChangeType, MessageStatus } from '../enums/whatsapp.enums';
import { MessageService } from './message.service';
import { MessageRepository } from '../repositories/message.repository';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  constructor(
    private readonly businessService: BusinessService,
    private readonly routerService: RouterService,
    private readonly messageService: MessageService,
    private readonly messageRepository: MessageRepository,
  ) {}

  async handleIncomingMessage(body: WhatsappIncomingPayload) {
    try {
      const change: ChangeValue = body.entry?.[0].changes?.[0].value;

      if (this.getChangeType(change) == ChangeType.STATUS_UPDATE) {
        return await this.handleMessageStatusUpdate(change);
      }

      const phoneNumberId = change.metadata?.phone_number_id;

      if (!phoneNumberId) return;

      const business: Business =
        await this.businessService.findByPhoneNumberId(phoneNumberId);
      if (!business) return;

      await this.handleMessage(change, business, JSON.stringify(body));

      return;
    } catch (err) {
      this.logger.error('WhatsApp Webhook Error:', err);
      throw new InternalServerErrorException(`Error Handling Webhook`);
    }
  }

  async handleMessageStatusUpdate(change: ChangeValue): Promise<void> {
    this.logger.log(`Handling Message Status Update`);
    const status = change?.statuses[0]?.status as MessageStatus;
    const messageId = change?.statuses[0]?.id;
    const timestamp = change?.statuses[0]?.timestamp;
    const formattedTimestamp: Date = new Date(Number(timestamp) * 1000);
    await this.messageService.updateMessageStatus(
      status,
      messageId,
      formattedTimestamp,
    );
  }

  async handleMessage(
    change: ChangeValue,
    business: Business,
    rawPayload: string,
  ): Promise<void> {
    const messageObj = change?.messages[0];
    if (!messageObj) {
      this.logger.debug(`No Message Content`);
      return;
    }
    return await this.messageService.saveNewIncomingMessage(
      messageObj,
      business,
      rawPayload,
    );
  }

  private getChangeType(change: ChangeValue): ChangeType {
    if (change?.statuses?.length > 0) {
      return ChangeType.STATUS_UPDATE;
    }
    return ChangeType.MESSAGE;
  }

  async findMessages() {
    return this.messageRepository.find();
  }
}
