import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Product } from './interfaces/product.interface';
import { ProductsResponse } from './interfaces/products-response.interface';

@Injectable()
export class ProductsService {
  async findAll(): Promise<Product[]> {
    let page = 1;
    let totalPages = 1;

    const products: Product[] = [];

    do {
      const { data } = await axios.get<ProductsResponse>(
        `${process.env.ACSA_API_URL}/products`,
        {
          params: {
            page,
            limit: 50,
          },
        },
      );

      products.push(...data.data);

      totalPages = data.meta.total_pages;
      page++;
    } while (page <= totalPages);

    return products;
  }
}
