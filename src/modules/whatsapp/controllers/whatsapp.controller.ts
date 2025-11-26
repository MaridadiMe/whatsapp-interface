import { Body, Controller, Get, HttpCode, Logger, Post, Query, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpStatusCode } from "axios";
import { PublicRoute } from "src/modules/auth/decorators/public-route.decorator";
import { WhatsappService } from "../services/whatsapp.service";

@Controller('whatsapp')
export class WhatsappController {
    private readonly logger = new Logger(WhatsappController.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly whatsappService: WhatsappService
    ){}


    @Get()
    @PublicRoute()
    @HttpCode(HttpStatusCode.Ok)
    verifySecurityChallenge(
        @Query('hub.mode') mode: string,
        @Query('hub.challenge') challenge: string,
        @Query('hub.verify_token') token: string
    ){
        this.logger.debug(`Mode: ${mode} \n Challenge: ${challenge} \n Token: ${token}`)
        const appVerificationToken = this.configService.get('VERIFICATION_TOKEN');
        if(mode === 'subscribe' && token === appVerificationToken){
            return challenge;
        }
        this.logger.error('Challenge Verification Failed');
        throw new UnauthorizedException('Challenge Verification Failed');
    }

    @Post()
    async handleWebhook(
        @Body() body: any
    ){
        this.logger.debug(`Received Message From Meta: \n ${JSON.stringify(body)}`);
        return this.whatsappService.handleIncomingMessage(body);
    }
}