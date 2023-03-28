import { Module } from '@nestjs/common';
import { CustomerModule } from './customer/customer.module';
import { SecurityModule } from './security/security.module';
import { FirestoreModule } from './firestore/firestore.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [CustomerModule, SecurityModule, ConfigModule.forRoot({
    isGlobal: true,
  }),
  FirestoreModule.forRoot({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      keyFilename: configService.get<string>('SA_KEY'),
    }),
    inject: [ConfigService],
  }),],
})

export class AppModule {}
