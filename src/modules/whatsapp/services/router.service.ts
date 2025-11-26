import { Injectable, Logger } from '@nestjs/common';
import { RestaurantHandler } from '../handlers/restaurant.handler';
import { MarketFreshHandler } from '../handlers/market-fresh.handler';
import { RideShareHandler } from '../handlers/ride-share.handler';
import { ChangeValue } from '../types/whatsapp';
import { Business } from '../entities/business.entity';

@Injectable()
export class RouterService {
  private readonly logger = new Logger(RouterService.name);
  constructor(
    private restaurant: RestaurantHandler,
    private marketFresh: MarketFreshHandler,
    private rideShare: RideShareHandler,
  ) {}

  async routeToHandler(business: Business, change: ChangeValue) {
    switch (business.name) {
      case 'restaurant':
        return this.restaurant.handle(change, business);
      case 'marketFresh':
        return this.marketFresh.handle(change, business);
      case 'rideShare':
        return this.rideShare.handle(change, business);
      default:
        this.logger.debug('Unknown business type');
    }
  }
}
