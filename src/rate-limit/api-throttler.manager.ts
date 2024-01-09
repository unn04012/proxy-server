import { Injectable } from '@nestjs/common';
import { RateLimitTokenBucket } from './rate-limit-token-bucket';

@Injectable()
export class ApiThrolttlerManager {
  constructor(private readonly _apiThrottler: RateLimitTokenBucket) {}

  public async setToken(userId: string) {
    const timestamp = Date.now();
    await this._apiThrottler.getToken(userId, timestamp);
  }
}
