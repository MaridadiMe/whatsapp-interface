import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, Index, OneToMany } from "typeorm";
import { Message } from "./message.entity";

@Entity('businesses')
export class Business extends BaseEntity {
  
  @Index('WIS_BUSINESS_NAME', ['name'], {unique: true})
  @Column()
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @Index('WIS_BUSINESS_PHONE', ['phoneNumberId'], {unique: true})
  @Column()
  phoneNumberId: string;

  
  @Column({ type: 'varchar', length: 100, nullable: true })
  wabaId?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  verifiedName?: string;

  
  
  @Column({ type: 'varchar', length: 100 })
  accessTokenKey: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  webhookVerifyTokenKey?: string;

  
  @Column({ default: true })
  isActive: boolean;

  
  @Column({ type: 'varchar', length: 255, nullable: true })
  webhookUrl?: string;

  
  @Column({ type: 'varchar', length: 50, nullable: true })
  billingPlan?: string;

  @Column({ type: 'datetime', nullable: true })
  subscriptionExpiry?: Date;

  @OneToMany(()=> Message, message=> message.business)
  messages: Message[]
}
