import { Injectable, RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RestclientService } from 'src/modules/restclient/restclient.service';
import { Business } from '../entities/business.entity';
import { ChangeValue } from '../types/whatsapp';

@Injectable()
export class WhatsAppReplyService {
  constructor(
    private readonly restClient: RestclientService,
    private readonly configService: ConfigService,
  ) {}

  async sendMessage(payload: any, business: Business): Promise<ChangeValue> {
    const whatsappUrl = `https://graph.facebook.com/v22.0/${business.phoneNumberId}/messages`;

    const headers = {
      Authorization: `Bearer ${this.configService.get(business.accessTokenKey)}`,
    };
    return this.restClient.request({
      url: whatsappUrl,
      method: RequestMethod.POST,
      headers,
      payload: payload,
    }) as unknown as ChangeValue;
  }
}
