import { AddressDto } from '../dto/address.dto';

export class CustomerDocument {
  static collectionName = 'cutomers';

  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: AddressDto;
}

