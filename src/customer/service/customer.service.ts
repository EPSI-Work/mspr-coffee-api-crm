import {
  Injectable,
  Inject,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CollectionReference, DocumentReference, QuerySnapshot } from '@google-cloud/firestore';
import { CustomerDocument } from '../document/customer.document';
import { CustomerDto } from '../dto';

@Injectable()
export class HouseService {
  private logger: Logger = new Logger(HouseService.name);

  constructor(
    @Inject(CustomerDocument.collectionName)
    private customersCollection: CollectionReference<CustomerDocument>,
  ) {}

  async findAll(): Promise<CustomerDocument[]> {
    const snapshot = await this.customersCollection.get();
    const customers: CustomerDocument[] = [];
    snapshot.forEach(doc => customers.push(doc.data()));
    return customers;
  }

  async findOne(id : number): Promise<CustomerDocument> {
    const snapshot = await this.customersCollection.doc(id.toString());
    const doc = await snapshot.get();
    if(doc.exists){
      return doc.data();
    }else{
      throw new NotFoundException(`L'utilisateur avec l'id ${id} n'a pas été trouvé`);
    }
  } 

  async findByName(name: string): Promise<CustomerDocument> {
    const snapshot: QuerySnapshot = await this.customersCollection
      .where('name', '==', name)
      .get();

    if (snapshot.empty) {
      throw new NotFoundException(`L'utilisateur ${name} n'a pas été trouvé`);
    }

    const [firstResult] = snapshot.docs;
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
