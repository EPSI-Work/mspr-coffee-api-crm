import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from '../service/product.service';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('customers/:customerId/orders/:orderId/products')
  async findProductsOfOrder(
    @Param('customerId') customerId: string,
    @Param('orderId') orderId: string,
  ) {
    return await this.productService.findProductsOfOrder(customerId, orderId);
  }

  @Get('products')
  async getProducts(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return await this.productService.findAll(page, limit);
  }
}
