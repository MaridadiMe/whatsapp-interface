import { Injectable, Logger } from "@nestjs/common";
import { BusinessService } from "./business.service";
import { RouterService } from "./router.service";

@Injectable()
export class WhatsappService {
    private readonly logger = new Logger(WhatsappService.name);

    constructor(
    private readonly businessService: BusinessService,
    private readonly routerService: RouterService,
  ) {}


    async handleIncomingMessage(body: any){

    try {
      const entry = body.entry?.[0].changes?.[0].value;
      const phoneNumberId = entry.metadata?.phone_number_id;

      if (!phoneNumberId) return;

      // Identify which business this message belongs to
      const business = await this.businessService.findByPhoneNumberId(phoneNumberId);
      if (!business) return;

      // Pass the whole message to the right handler
      await this.routerService.routeToHandler(business, entry);

      return { status: 'ok' };
    } catch (err) {
      console.error('WhatsApp Webhook Error:', err);
    }

    }
}