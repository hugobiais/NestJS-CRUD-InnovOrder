import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(
    config: ConfigService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager,
  ) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  cleanDb() {
    return this.$transaction([this.user.deleteMany()]);
  }

  async cleanCache() {
    return await this.cacheManager.reset();
  }
}
