import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Business } from './business.entity';
import {
  MessageDirection,
  MessageStatus,
  MessageType,
} from '../enums/whatsapp.enums';

@Entity({ name: 'messages' })
export class Message extends BaseEntity {
  @Index('WIS_WA_MESSAGE_ID', ['whatsappMessageId'], { unique: true })
  @Column()
  whatsappMessageId: string;

  @Index('WIS_MSG_FROM', ['from'], { unique: true })
  @Column({ length: 20 })
  from: string;

  @Index('WIS_MSG_TO', ['to'], { unique: true })
  @Column({ length: 20 })
  to: string;

  @Column({
    type: 'enum',
    enum: MessageDirection,
  })
  direction: MessageDirection;

  @Column({
    type: 'enum',
    enum: MessageType,
    default: 'text',
  })
  type: string;

  @Column({ type: 'text', nullable: true })
  body: string | null;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: 'sent',
  })
  status: string;

  @Column({ type: 'datetime', nullable: true })
  sentAt: Date | null;

  @Column({ type: 'datetime', nullable: true })
  deliveredAt: Date | null;

  @Column({ type: 'datetime', nullable: true })
  readAt: Date | null;

  @Column({ type: 'datetime', nullable: true })
  failedAt: Date | null;

  @ManyToOne(() => Business, (business) => business.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'businessId' })
  business: Business;

  @Index('WIS_MSG_BUSINESS_ID', ['businessId'], { unique: true })
  @Column()
  businessId: string;

  // @Index('WIS_CONV_ID', ['conversationId'], { unique: true })
  // @Column({ type: 'varchar', length: 36 })
  // conversationId: string;

  @Column({ type: 'json', nullable: true })
  rawPayload: any;
}
