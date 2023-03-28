import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CustomerModule } from './customer/customer.module';
import { SecurityModule } from './security/security.module';
import { FirestoreModule } from './firestore/firestore.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiKeyMiddleware } from './security/security.middleware';

@Module({
  imports: [CustomerModule, SecurityModule, ConfigModule.forRoot({
    isGlobal: true,
  }),
  FirestoreModule.forRoot({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      keyFilename: configService.get<string>('FIREBASE_KEY'),
    }),
    inject: [ConfigService],
  }),],
  providers: [{
    provide: APP_GUARD,
    useClass: ApiKeyMiddleware,
  }],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).exclude('/api-key').forRoutes('*');
  }
}
