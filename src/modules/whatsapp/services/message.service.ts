import { Injectable, Logger } from '@nestjs/common';
import { MessageRepository } from '../repositories/message.repository';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);
  constructor(private readonly repository: MessageRepository) {}
}
