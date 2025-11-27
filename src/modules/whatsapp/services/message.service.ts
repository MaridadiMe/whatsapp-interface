import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MessageRepository } from '../repositories/message.repository';
import { MessageDirection, MessageStatus } from '../enums/whatsapp.enums';
import { time } from 'console';
import { Message } from '../types/whatsapp';
import { Business } from '../entities/business.entity';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);
  constructor(private readonly repository: MessageRepository) {}

  async updateMessageStatus(
    status: MessageStatus,
    messageId: string,
    timestamp: Date,
  ): Promise<void> {
    try {
      const message = await this.repository.findOneBy({
        whatsappMessageId: messageId,
      });

      if (!message) {
        this.logger.debug(`Message ${messageId} Does Not Exist`);
        return;
      }

      this.logger.log(`Status:: ${status}`);

      switch (status) {
        case MessageStatus.READ:
          message.readAt = timestamp;
          break;
        case MessageStatus.DELIVERED:
          message.deliveredAt = timestamp;
          break;
        case MessageStatus.FAILED:
          message.failedAt = timestamp;
          break;
        case MessageStatus.SENT:
          message.sentAt = timestamp;
          break;
        default:
          message.failedAt = timestamp;
      }

      await this.repository.save(message);
    } catch (error) {
      this.logger.error(
        `Error While Updating The Message Status ==> ${error.message}`,
      );
      throw new InternalServerErrorException(
        `Error While Updating The Message Status`,
      );
    }
  }

  async saveNewMessage(
    messageObj: Message,
    business: Business,
    rawPayload: string,
  ): Promise<void> {
    const messageBody = messageObj?.text?.body;
    const messageId = messageObj?.id;
    const timestamp = messageObj?.timestamp;
    const formattedTimestamp: Date = new Date(Number(timestamp) * 1000);

    try {
      const existingMessage = await this.repository.findOneBy({
        whatsappMessageId: messageId,
      });
      if (existingMessage) {
        this.logger.debug(
          `Message Already Exists, Nothing To Do:: ${messageId}`,
        );
        return;
      }

      const rawMessage = this.repository.create({
        whatsappMessageId: messageId,
        from: messageObj.from,
        to: business.displayPhoneNumber,
        body: messageBody,
        type: messageObj.type,
        sentAt: formattedTimestamp,
        direction: MessageDirection.INBOUND,
        businessId: business.id,
        rawPayload: rawPayload,
      });
      await this.repository.save(rawMessage);
    } catch (error) {
      this.logger.error(`Error Saving New Message:: ${error.message}`);
      throw new InternalServerErrorException(`Error Saving The Message`);
    }
  }
}
