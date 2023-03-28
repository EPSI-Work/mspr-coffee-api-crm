import { Module } from '@nestjs/common';
import { SecurityController } from './controller/security.controller'
import { SecurityService } from './service/security.service'

@Module({
    controllers: [SecurityController],
    providers: [SecurityService],
})
export class SecurityModule {}
