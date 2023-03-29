import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CustomerDto } from './customer.dto';
import { CustomerService } from "../service/customer.service";
import { validate } from 'class-validator';
import { QuerySnapshot } from '@google-cloud/firestore';

@Injectable()
export class UniqueEmailValidationPipe implements PipeTransform {
  constructor(private customerService: CustomerService) {}

  async transform(customerDto: CustomerDto): Promise<CustomerDto> {
    const errors = await validate(customerDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const emailSnapshot: QuerySnapshot = await this.customerService.customersCollection
      .where('email', '==', customerDto.email)
      .limit(1)
      .get();

    if (!emailSnapshot.empty) {
      throw new BadRequestException(`L'adresse e-mail ${customerDto.email} est déjà utilisée.`);
    }

    return customerDto;
  }
}
