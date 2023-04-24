import { Controller, Get } from '@nestjs/common';
import { SecurityService } from "../service/security.service";


@Controller('api-key')
export class SecurityController {
  constructor(private securityService: SecurityService) {}

  @Get()
    getApiKey() {
    return this.securityService.generateApiKey()
    }
  
}
