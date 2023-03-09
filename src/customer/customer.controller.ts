import { Controller, Post } from "@nestjs/common"
import { CustomerService } from "./customer.service";

@Controller('customer')
export class CustomerController {
    constructor(private CustomerService: CustomerService) {}

    @Post('getCustomer')
    getCustomer() {
        return 'test'
    }
}