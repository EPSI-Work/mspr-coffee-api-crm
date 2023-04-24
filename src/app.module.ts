import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { CustomerModule } from './customer/customer.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { SecurityModule } from './common/security/security.module';
import { FirestoreModule } from './common/firestore/firestore.module';
import { ApiKeyMiddleware } from './common/security/security.middleware';

@Module({
  imports: [CustomerModule, OrderModule, ProductModule, SecurityModule, ConfigModule.forRoot({
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
