import { Injectable, Logger } from '@nestjs/common';
import { HttpClient } from 'src/common/http-client.service';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';

@Injectable()
export class ProductService {
  private logger: Logger = new Logger(ProductService.name);
  private readonly apiBaseUrl: string;
  private readonly httpClient: HttpClient;

  constructor(private readonly configService: ConfigService) {
    this.apiBaseUrl = this.configService.get<string>('MOCK_API_URL');
    this.httpClient = new HttpClient();
  }

  async findProductsOfOrder(customerId: string, orderId: string) {
    if (this.isAnyCustomer(customerId) && this.isAnyOrder(customerId, orderId)) {
      const url = `${this.apiBaseUrl}/customers/${customerId}/orders/${orderId}/products`;

      try {
        const response: AxiosResponse = await this.httpClient.get(url);
        return response.data;
      } catch (error) {
        this.logger.error(`Les produits de la commande avec l'id ${orderId} n'ont pas été trouvés: ${error.message}`);
        return { message: `Les produits de la commande avec l'id ${orderId} n'ont pas été trouvés` };
      }
    } else {
      return { message: `Le client avec l'id ${customerId} et/ou la commande n'ont pas été trouvés` };
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ message: string } | { products: any[], totalCount: number, totalPages: number, currentPage: number }> {
    const url = `${this.apiBaseUrl}/products?page=${page}&limit=${limit}`;
  
    try {
      const response: AxiosResponse = await this.httpClient.get(url);
      const totalCount = response.headers['x-total-count'];
      const totalPages = Math.ceil(totalCount / limit);
      const currentPage = page;
      const products = response.data;
  
      return { products, totalCount, totalPages, currentPage };
    } catch (error) {
      this.logger.error(`Les produits n'ont pas été trouvés: ${error.message}`);
      return { message: `Les produits n'ont pas été trouvés` };
    }
  }
  
  async isAnyCustomer(customerId: string): Promise<boolean> {
    const url = `${this.apiBaseUrl}/customers/${customerId}`;

    try {
      const response = await this.httpClient.get(url);
      return response.status === 200;
    } catch (error) {
      this.logger.error(`Le client avec l'id ${customerId} n'a pas été trouvé: ${error.message}`);
    }
  }

  async isAnyOrder(customerId: string, orderId: string): Promise<boolean> {
    const url = `${this.apiBaseUrl}/customers/${customerId}/orders/${orderId}`;

    try {
      const response = await this.httpClient.get(url);
      return response.status === 200;
    } catch (error) {
      this.logger.error(`La commande avec l'id ${customerId} n'a pas été trouvée: ${error.message}`);
    }
  }
}
