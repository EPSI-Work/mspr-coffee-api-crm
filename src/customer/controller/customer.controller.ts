import { Controller, Post, Put, Get, Body, Param, Delete } from "@nestjs/common"
import { CustomerService } from "../service/customer.service"
import { CustomerDto } from "../dto"

@Controller('customer')
export class CustomerController {
    constructor(private CustomerService: CustomerService) {}


    @Post()
    addCustomer(@Body() dto: CustomerDto) {
        return this.CustomerService.addCustomer(dto)
    }

    @Put()
    editCustomer(@Body() dto: CustomerDto) {
        return this.CustomerService.editCustomer(dto)
    }

    @Get()
    getCustomerById(@Param() id: string) {
        return this.CustomerService.getCustomerById(id)
    }

    @Get()
    getCustomerByName(@Body() name: string) {
        return this.CustomerService.getCustomersByName(name)
    }

    @Delete()
    deleteCustomer(@Param('id') id: string) {
        const stringId = id.toString()

        return this.CustomerService.deleteCustomer(stringId)
    }
}