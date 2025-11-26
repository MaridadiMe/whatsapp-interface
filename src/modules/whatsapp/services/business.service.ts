import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class BusinessService{
  private readonly logger = new Logger(BusinessService.name);
    async findByPhoneNumberId(phoneNumberId: string){
      this.logger.debug(`Finding Business By Phone Number Id, ${phoneNumberId}`);
        const businesses = ['restaurant', 'marketFresh', 'rideShare'];

        const randomBusiness =
    businesses[Math.floor(Math.random() * businesses.length)];

  return randomBusiness;
    }
}