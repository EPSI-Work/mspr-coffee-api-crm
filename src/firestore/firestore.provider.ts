import { CustomerDocument } from "../customer/document/customer.document";

export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions'
export const FirestoreCollectionProviders: string[] = [
    CustomerDocument.collectionName,
];
