import { Controller, Get, Post } from "@nestjs/common";
import { PublicRoute } from "src/modules/auth/decorators/public-route.decorator";

@Controller('whatsapp')
export class WhatsappController {


    @Get()
    @PublicRoute()
    async verifySecurityChallenge(){

    }

    @Post()
    async handleWebhook(){

    }
}