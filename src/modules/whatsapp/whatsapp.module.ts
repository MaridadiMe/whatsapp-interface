import { Module } from "@nestjs/common";
import { WhatsappController } from "./controllers/whatsapp.controller";
import { WhatsappService } from "./services/whatsapp.service";
import { BusinessService } from "./services/business.service";
import { RouterService } from "./services/router.service";
import { MarketFreshHandler } from "./handlers/market-fresh.handler";
import { RestaurantHandler } from "./handlers/restaurant.handler";
import { RideShareHandler } from "./handlers/ride-share.handler";
import { RestClientModule } from "../restclient/restclient.module";

@Module({
    imports: [RestClientModule],
    exports: [],
    controllers: [WhatsappController],
    providers:[WhatsappService, BusinessService, RouterService, MarketFreshHandler, RestaurantHandler, RideShareHandler]
})
export class WhatsappModule{}