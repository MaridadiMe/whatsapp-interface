import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Message } from '../entities/message.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class MessageRepository extends BaseRepository<Message> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(dataSource, Message);
  }
}
