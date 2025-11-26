import { Injectable, RequestMethod } from "@nestjs/common";
import { RestclientService } from "src/modules/restclient/restclient.service";

@Injectable()
export class RestaurantHandler {
    constructor(
        private readonly restClient: RestclientService
    ){}

    async handle(message: any, business: any) {
    const userText = message.messages?.[0]?.text?.body;
    const from = message.messages?.[0]?.from;

    let reply = "Welcome to our restaurant!";

    // Add AI logic or keyword detection
    if (userText?.toLowerCase().includes("menu")) {
      reply = "Our Menu: Pizza, Chips, Chicken, Drinks";
    }

    await this.restClient.request({
        url: `https://graph.facebook.com/v20.0/${business.phoneNumberId}/messages`,
        method: RequestMethod.POST,
        payload: {
            messaging_product: "whatsapp",
            to: from,
            text: { body: reply },
        },
        headers: { Authorization: `Bearer ${business.whatsappToken}` }
    });
  }
}