import { Controller, Post, Get, Body } from "@nestjs/common"
import { CustomerService } from "./customer.service"
import { CustomerDto } from "./dto"

@Controller('customer')
export class CustomerController {
    constructor(private CustomerService: CustomerService) {}


    @Post()
    addCustomer(@Body() dto: CustomerDto) {
        return this.CustomerService.addCustomer(dto)
    }

    @Get()
    getCustomerById(@Body() id: number) {
        return id
    }
}