import { Injectable } from '@nestjs/common';
import { RateLimitTokenBucket } from './rate-limit-token-bucket';
import { TokenBucketStorer } from './token-bucket-storer';

@Injectable()
export class ApiThrolttlerManager {
  constructor(
    private readonly _apiThrottler: RateLimitTokenBucket,
    private readonly _storer: TokenBucketStorer,
  ) {}

  public async setToken(userId: string) {
    const timestamp = Date.now();
    await this._apiThrottler.getToken(userId, timestamp);
  }

  public all() {
    return this._storer.all();
  }
}
