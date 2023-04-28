import {
  Controller,
  Get,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { FoodService } from './food.service';

@UseGuards(JwtGuard)
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get(':barcode')
  async getProduct(@Param('barcode') barcode: string) {
    try {
      const product = await this.foodService.getProduct(barcode);
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
