import { Injectable } from "@nestjs/common"
import * as crypto from 'crypto';

@Injectable({})
export class SecurityService {
    generateApiKey(): { apiKey: string } {
        const apiKey = crypto.randomBytes(16).toString('hex');
        process.env.API_KEY = apiKey;
    
        return { apiKey };
      }
}