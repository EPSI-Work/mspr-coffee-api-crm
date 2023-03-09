import { Module } from '@nestjs/common';
import { CustomerModule } from './customer/customer.module';
import { SecurityModule } from './security/security.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [CustomerModule, SecurityModule, PrismaModule],
})

export class AppModule {}
