import { Injectable, Logger } from '@nestjs/common';
import { BusinessService } from './business.service';
import { RouterService } from './router.service';
import { ChangeValue, WhatsappIncomingPayload } from '../types/whatsapp';
import { Business } from '../entities/business.entity';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  constructor(
    private readonly businessService: BusinessService,
    private readonly routerService: RouterService,
  ) {}

  async handleIncomingMessage(body: WhatsappIncomingPayload) {
    try {
      const change: ChangeValue = body.entry?.[0].changes?.[0].value;
      const phoneNumberId = change.metadata?.phone_number_id;

      if (!phoneNumberId) return;

      // Identify which business this message belongs to
      const business: Business =
        await this.businessService.findByPhoneNumberId(phoneNumberId);
      if (!business) return;

      // Pass the whole message to the right handler
      await this.routerService.routeToHandler(business, change);

      return { status: 'ok' };
    } catch (err) {
      console.error('WhatsApp Webhook Error:', err);
    }
  }
}
