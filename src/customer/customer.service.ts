import { Injectable } from "@nestjs/common"
import { ForbiddenException } from "@nestjs/common/exceptions"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime"
import { PrismaService } from '../prisma/prisma.service'
import { AddressDto, CustomerDto } from "./dto"

@Injectable({})
export class CustomerService {
    constructor(private prisma: PrismaService) {}

    async addCustomer(customerDto: CustomerDto) {
        // Vérifie si l'adresse email existe déjà
        const existingCustomer = await this.prisma.customer.findUnique({
            where: {
            email: customerDto.email,
            },
        })

        if (existingCustomer) {
            throw existingCustomer
        }

        const addressDto = new AddressDto()
        addressDto.street = customerDto.address.street
        addressDto.city = customerDto.address.city
        addressDto.zipCode = customerDto.address.zipCode
        addressDto.country = customerDto.address.country

        let customer = {}

        try {
            customer = await this.prisma.customer.create({
                data: {
                    firstName: customerDto.firstName,
                    lastName: customerDto.lastName,
                    email: customerDto.email,
                    phone: customerDto.phone,
                    address: addressDto.toCreateNestedInput()
                }
            })
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError) {
                if(error.code === 'P2002') {
                    throw new ForbiddenException
                }

                throw error
            }
        }

        return customer
    }

    getCustomer() {}
}