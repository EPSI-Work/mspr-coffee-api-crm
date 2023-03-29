import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const apiKey: string = this.configService.get<string>('API_KEY');
    const authHeader: string = req.header('Authorization');

    if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
      return res.status(401).send(`Vous n'avez pas les autorisations nécessaires, veuillez renseigner une clé`);
    }

    next();
  }
}
