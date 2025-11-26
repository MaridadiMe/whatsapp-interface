import { Injectable, RequestMethod } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RestclientService } from "src/modules/restclient/restclient.service";

@Injectable()
export class RideShareHandler {
   constructor(
           private readonly restClient: RestclientService,
           private readonly configService: ConfigService
       ){}
   
       private readonly APP_TOKEN = this.configService.get('APP_TOKEN');
   
       async handle(message: any, business: any) {
       const userText = message.messages?.[0]?.text?.body;
       const from = message.messages?.[0]?.from;
   
       let reply = "Welcome to our restaurant!";
   
       // Add AI logic or keyword detection
       if (userText?.toLowerCase().includes("menu")) {
         reply = "Our Menu: Pizza, Chips, Chicken, Drinks";
       }
   
       await this.restClient.request({
           url: `https://graph.facebook.com/v20.0/898464770011278/messages`,
           method: RequestMethod.POST,
           payload: {
               messaging_product: "whatsapp",
               to: from,
               text: { body: reply },
           },
           headers: { Authorization: `Bearer ${this.APP_TOKEN}` }
       });
     }
}