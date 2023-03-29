import { AddressDto } from '../dto/address.dto';

export enum CustomerType {
  Prospect = 'prospect',
  Customer = 'customer',
}

export class CustomerDocument {
  static collectionName = 'cutomers';

  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: AddressDto;
  createdAt: Date;
  type: CustomerType;
}
