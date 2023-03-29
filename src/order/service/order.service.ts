import {
    Injectable,
    Logger,
  } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
  import { AxiosResponse } from 'axios';
  import { HttpClient } from 'src/common/http-client.service';
  
  @Injectable()
  export class OrderService {
    private logger: Logger = new Logger(OrderService.name);
    private configService = new ConfigService
    private readonly apiBaseUrl = this.configService.get<string>('MOCK_API_URL');
  
    constructor(private readonly httpClient: HttpClient) {}
  
    async findOneOfCustomer(customerId: string, orderId: string): Promise<any> {
      if (this.isAnyCustomer(customerId)) {
        const url = `${this.apiBaseUrl}/customers/${customerId}/orders/${orderId}`;
  
        try {
          const response: AxiosResponse = await this.httpClient.get(url);
          return response.data;
        } catch (error) {
          this.logger.error(`La commande avec l'id ${orderId} n'a pas été trouvée: ${error.message}`);
          return { message: `La commande avec l'id ${orderId} n'a pas été trouvée` };
        }
      } else {
        return { message: `Le client avec l'id ${customerId} n'a pas été trouvé` };
      }
    }
  
    async findAllOfCustomer(customerId: string):  Promise<{ message: string } | any[]> {
      if (this.isAnyCustomer(customerId)) {
        const url = `${this.apiBaseUrl}/customers/${customerId}/orders`;
    
        try {
          const response: AxiosResponse = await this.httpClient.get(url);
          return response.data;
        } catch (error) {
          this.logger.error(`Les commandes n'ont pas été trouvées: ${error.message}`);
          return { message: `Les commandes n'ont pas été trouvées` };
        }
      } else {
        return { message: `Le client avec l'id ${customerId} n'a pas été trouvé` };
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
  }
  