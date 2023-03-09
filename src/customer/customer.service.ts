import { Injectable } from "@nestjs/common"
import { Customer } from "@prisma/client"
import { PrismaService } from '../prisma/prisma.service'

@Injectable({})
export class CustomerService {
    constructor(private prisma: PrismaService) {}

    getUser() {}
}