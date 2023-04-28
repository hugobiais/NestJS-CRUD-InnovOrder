import {
  Controller,
  Get,
  Param,
  Inject,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { FoodService } from './food.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@UseGuards(JwtGuard)
@Controller('food')
export class FoodController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly foodService: FoodService,
  ) {}

  @Get(':barcode')
  async getProduct(@Param('barcode') barcode: string) {
    const cachedProduct = await this.cacheManager.get(barcode);
    if (cachedProduct) {
      console.log('Cache hit!');
      return cachedProduct;
    } else {
      console.log('Cache miss!');
      try {
        const product = await this.foodService.getProduct(barcode);
        await this.cacheManager.set(barcode, product, 300000); // set the TTL to 5mn
        return product;
      } catch (error) {
        if (error.response?.status === 404) {
          throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        } else {
          throw new HttpException(
            'Internal server error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    }

  }
}
