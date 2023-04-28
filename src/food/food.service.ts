import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class FoodService {
  private readonly API_URL =
    'https://off:off@world.openfoodfacts.net/api/v2/product/';

  async getProduct(barcode: string) {
    const response = await axios.get(`${this.API_URL}${barcode}`);
    return response.data;
  }
}
