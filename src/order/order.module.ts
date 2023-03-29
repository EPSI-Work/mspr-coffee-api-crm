import { Module } from '@nestjs/common';
import { HttpClient } from 'src/common/http-client.service';
import { OrderController } from './controller/order.controller'
import { OrderService } from './service/order.service'

@Module({
    controllers: [OrderController],
    providers: [OrderService, HttpClient],
})
export class OrderModule {}
