import { Controller, Post, Put, Get, Body, Param, Delete, Query } from "@nestjs/common";
import { CustomerService } from "../service/customer.service";
import { CustomerDto } from "../dto/customer.dto";
import { UniqueEmailValidationPipe } from "../dto/customer.validator.pipe";
import { CustomerDocument } from "../document/customer.document";

@Controller('customers')
export class CustomerController {
    constructor(private customerService: CustomerService) {}

    @Post()
        async add(@Body(UniqueEmailValidationPipe) customerDto: CustomerDto): Promise<CustomerDocument> {
        return this.customerService.add(customerDto);
    }

    @Put(':id')
    async updateCustomer(@Param('id') id: string, @Body() customerDto: CustomerDto) {
        return await this.customerService.edit(id, customerDto);
    }

    @Get(':id')
    async getCustomerById(@Param('id') id: string) {
        return await this.customerService.findOne(id);
    }

    @Get()
    async getCustomersByName(@Query('name') name: string) {
        return await this.customerService.findByName(name);
    }

    @Delete(':id')
    async deleteCustomer(@Param('id') id: string) {
        return await this.customerService.delete(id);
    }
}
