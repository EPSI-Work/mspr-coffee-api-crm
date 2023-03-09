import { Controller, Post } from "@nestjs/common"
import { SecurityService } from "./security.service";

@Controller('security')
export class SecurityController {
    constructor(private securityService: SecurityService) {}

    @Post('getApiKey')
    getApiKey() {
        return 'test'
    }
}