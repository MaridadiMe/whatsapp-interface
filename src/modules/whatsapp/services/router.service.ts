import { Injectable, Logger } from "@nestjs/common";
import { RestaurantHandler } from "../handlers/restaurant.handler";
import { MarketFreshHandler } from "../handlers/market-fresh.handler";
import { RideShareHandler } from "../handlers/ride-share.handler";

@Injectable()
export class RouterService {
    private readonly logger = new Logger(RouterService.name);
    constructor(
    private restaurant: RestaurantHandler,
    private marketFresh: MarketFreshHandler,
    private rideShare: RideShareHandler,
  ) {}

  async routeToHandler(business: any, message: any) {
    switch (business.type) {
      case 'restaurant':
        return this.restaurant.handle(message, business);
      case 'marketFresh':
        return this.marketFresh.handle(message, business);
      case 'rideShare':
        return this.rideShare.handle(message, business);
      default:
        this.logger.debug('Unknown business type');
    }
  }
}