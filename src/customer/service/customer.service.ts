import {
  Injectable,
  Inject,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CollectionReference, DocumentReference, QueryDocumentSnapshot, QuerySnapshot } from '@google-cloud/firestore';
import { CustomerDocument, CustomerType } from '../document/customer.document';
import { CustomerDto } from '../dto';

@Injectable()
export class CustomerService {
  private logger: Logger = new Logger(CustomerService.name);

  constructor(
    @Inject(CustomerDocument.collectionName)
    public customersCollection: CollectionReference<CustomerDocument>,
  ) {}

  async findAll(): Promise<CustomerDocument[]> {
    const snapshot = await this.customersCollection.get();
    const customers: CustomerDocument[] = [];
    snapshot.forEach(doc => customers.push(doc.data()));
    return customers;
  }

  async findOne(id : string): Promise<CustomerDocument> {
    const snapshot = await this.customersCollection.doc(id);
    const doc = await snapshot.get();
    if(doc.exists){
      return doc.data();
    }else{
      throw new NotFoundException(`L'utilisateur avec l'id ${id} n'a pas été trouvé`);
    }
  } 

  async findByName(name: string): Promise<CustomerDocument> {
    const firstNameSnapshot: QuerySnapshot = await this.customersCollection
      .where('firstName', '==', name)
      .get();

    const lastNameSnapshot: QuerySnapshot = await this.customersCollection
      .where('lastName', '==', name)
      .get();

    const allResults: QueryDocumentSnapshot[] = [
      ...firstNameSnapshot.docs,
      ...lastNameSnapshot.docs,
    ];

    if (allResults.length === 0) {
      throw new NotFoundException(`L'utilisateur ${name} n'a pas été trouvé`);
    }

    const [firstResult] = allResults;
    return firstResult.data() as CustomerDocument;
  }

  async add(customerDto: CustomerDto): Promise<CustomerDocument> {
    try {
      // Create UID
      const newDocRef: DocumentReference = this.customersCollection.doc();
      const newId: string = newDocRef.id;

      const customerData: CustomerDocument = {
        id: newId,
        firstName: customerDto.firstName,
        lastName: customerDto.lastName,
        email: customerDto.email,
        phone: customerDto.phone,
        address: customerDto.address,
        createdAt: undefined,
        type: CustomerType.Prospect
      };

      // Use set() instead of add() to define doc with a new id
      await newDocRef.set(customerData);

      return {
        ...customerData,
        id: newId,
      } as CustomerDocument;
    } catch (error) {
      this.logger.error(`Erreur lors de l'enregistrement du nouveau client : ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Erreur lors de l'enregistrement du nouveau client`);
    }
  }

  async edit(id: string, customerDto: CustomerDto): Promise<CustomerDocument> {
    try {
      const docRef = this.customersCollection.doc(id);
      const docSnapshot = await docRef.get();

      if (!docSnapshot.exists) {
        throw new NotFoundException(`L'utilisateur avec l'id ${id} n'a pas été trouvé`);
      }

      const updatedCustomerData: Partial<CustomerDocument> = {
        firstName: customerDto.firstName,
        lastName: customerDto.lastName,
        email: customerDto.email,
        phone: customerDto.phone,
        address: customerDto.address,
      };

      await docRef.update(updatedCustomerData);

      const updatedDocSnapshot = await docRef.get();
      return {
        ...updatedDocSnapshot.data(),
        id: updatedDocSnapshot.id,
      } as CustomerDocument;
    } catch (error) {
      this.logger.error(`Erreur lors de la modification du client  ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Erreur lors de la modification du client avec l'id ${id}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = this.customersCollection.doc(id);
      const docSnapshot = await docRef.get();

      if (!docSnapshot.exists) {
        throw new NotFoundException(`L'utilisateur avec l'id ${id} n'a pas été trouvé`);
      }

      await docRef.delete();
    } catch (error) {
      this.logger.error(`Erreur lors de la suppression client ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Erreur lors de la suppression du client avec l'id ${id}`);
    }
  }
}
