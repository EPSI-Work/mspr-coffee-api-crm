import { Controller, Get, Body, Param } from "@nestjs/common";
import { OrderService } from "../service/order.service";

@Controller()
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Get('customers/:customerId/orders/:orderId')
    async getOrderByCustomerId(@Param('customerId') customerId: string, @Param('orderId') orderId: string) {
        return await this.orderService.findOneOfCustomer(customerId, orderId);
    }

    @Get('customers/:customerId/orders')
    async getOrdersByCustomerId(@Param('customerId') customerId: string) {
        return await this.orderService.findAllOfCustomer(customerId);
    }
}
