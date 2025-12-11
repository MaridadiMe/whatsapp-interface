import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MessageRepository } from '../repositories/message.repository';
import { MessageDirection, MessageStatus } from '../enums/whatsapp.enums';
import { time } from 'console';
import { ChangeValue, WhatsappMessage } from '../types/whatsapp';
import { Business } from '../entities/business.entity';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Message } from '../entities/message.entity';
import { WhatsappModule } from '../whatsapp.module';
import { WhatsappModuleConstants } from '../constants/whatsapp-module-constants';
import { WhatsAppReplyService } from './whatsapp-reply.service';
import { BSON } from 'typeorm';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);
  constructor(
    private readonly repository: MessageRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly whatsappReplyService: WhatsAppReplyService,
  ) {}

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

  async saveNewIncomingMessage(
    messageObj: WhatsappMessage,
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
      const savedMessage = await this.repository.save(rawMessage);
      this.eventEmitter.emit(WhatsappModuleConstants.INCOMING_MESSAGE_SAVED, {
        message: savedMessage,
        business: business,
      });
    } catch (error) {
      this.logger.error(`Error Saving New Message:: ${error.message}`);
      throw new InternalServerErrorException(`Error Saving The Message`);
    }
  }

  @OnEvent(WhatsappModuleConstants.INCOMING_MESSAGE_SAVED)
  async handleIncomingMessageSaved(payload: {
    message: Message;
    business: Business;
  }) {
    // do something here

    try {
      const message = payload.message;
      const business = payload.business;

      const body = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: message.from,
        type: 'text',
        text: {
          body: 'Hi, Welcome To Our World!. We can definitely make you happy today. Tell us What you are looking for and we will gladly assist',
        },
      };

      const response: ChangeValue = await this.whatsappReplyService.sendMessage(
        body,
        business,
      );

      const reply = this.repository.create({
        from: message.to,
        to: message.from,
        businessId: message.businessId,
        direction: MessageDirection.OUTBOUND,
        whatsappMessageId: response.messages[0].id,
        body: body.text.body,
        rawPayload: JSON.stringify(body),
      });

      await this.repository.save(reply);
    } catch (error) {
      this.logger.error(`Error While Replying:....`, error.message);
    }
  }
}
