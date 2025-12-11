import { Module } from '@nestjs/common';
import { WhatsappController } from './controllers/whatsapp.controller';
import { WhatsappService } from './services/whatsapp.service';
import { BusinessService } from './services/business.service';
import { RouterService } from './services/router.service';
import { MarketFreshHandler } from './handlers/market-fresh.handler';
import { RestaurantHandler } from './handlers/restaurant.handler';
import { RideShareHandler } from './handlers/ride-share.handler';
import { RestClientModule } from '../restclient/restclient.module';
import { BusinessRepository } from './repositories/business.repository';
import { MessageRepository } from './repositories/message.repository';
import { MessageService } from './services/message.service';
import { WhatsAppReplyService } from './services/whatsapp-reply.service';

@Module({
  imports: [RestClientModule],
  exports: [],
  controllers: [WhatsappController],
  providers: [
    WhatsappService,
    WhatsAppReplyService,
    BusinessService,
    RouterService,
    MarketFreshHandler,
    RestaurantHandler,
    RideShareHandler,
    BusinessRepository,
    MessageRepository,
    MessageService,
  ],
})
export class WhatsappModule {}
