import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { OrderService } from '../../src/order/service/order.service';
import { HttpClient } from '../../src/common/http-client.service';

describe('OrderService', () => {
  let orderService: OrderService;
  let httpClient: HttpClient;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        HttpClient,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'http://localhost:3000/api'),
          },
        },
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    httpClient = module.get<HttpClient>(HttpClient);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
  });

  describe('findOneOfCustomer', () => {
    it('should return the order of a customer', async () => {
      const customerId = '8';
      const orderId = '58';
      const data = { id: orderId, customerId: customerId };
      jest.spyOn(httpClient, 'get').mockResolvedValueOnce({ data } as AxiosResponse);

      const result = await orderService.findOneOfCustomer(customerId, orderId);

      expect(result).toEqual(data);
    });

    it('should return an error message if the order is not found', async () => {
      const customerId = '1';
      const orderId = '9999';
      const expectedMessage = `La commande avec l'id ${orderId} n'a pas été trouvée`;
      jest.spyOn(httpClient, 'get').mockRejectedValueOnce(new Error());

      const result = await orderService.findOneOfCustomer(customerId, orderId);

      expect(result).toEqual({ message: expectedMessage });
    });

    it('should return an error message if the customer is not found', async () => {
      const customerId = '9999';
      const orderId = '1';
      const expectedMessage = `La commande avec l'id 1 n'a pas été trouvée`;

      const result = await orderService.findOneOfCustomer(customerId, orderId);

      expect(result).toEqual({ message: expectedMessage });
    });
  });

  describe('findAllOfCustomer', () => {
    it('should return the orders of a customer', async () => {
      const customerId = '8';
      const data = [
        {
            "createdAt": "2023-02-20T03:03:50.182Z",
            "id": "8",
            "customerId": "8"
        },
        {
            "createdAt": "2023-02-19T23:40:49.654Z",
            "id": "58",
            "customerId": "8"
        }
    ];
      jest.spyOn(httpClient, 'get').mockResolvedValueOnce({ data } as AxiosResponse);

      const result = await orderService.findAllOfCustomer(customerId);

      expect(result).toEqual(data);
    });

    it('should return an error message if the orders are not found', async () => {
      const customerId = '1';
      const expectedMessage = `Les commandes n'ont pas été trouvées`;
      jest.spyOn(httpClient, 'get').mockRejectedValueOnce(new Error());

      const result = await orderService.findAllOfCustomer(customerId);

      expect(result).toEqual({ message: expectedMessage });
    });

    it('should return an error message if the customer is not found', async () => {
      const customerId = '9999';
      const expectedMessage = `Les commandes n'ont pas été trouvées`;

      const result = await orderService.findAllOfCustomer(customerId);

      expect(result).toEqual({ message: expectedMessage });
    });
  });
 });