import { ConfigModule } from '@nestjs/config';

import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { FoodModule } from './food/food.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    FoodModule,
  ],
})
export class AppModule {}
