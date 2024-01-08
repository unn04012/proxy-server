import { Injectable } from '@nestjs/common';
import { TokenBucketStorer } from './token-bucket-storer';

@Injectable()
export class RateLimitTokenBucket {
  constructor(
    private readonly _bucketSize: number,
    private readonly _bucketStorer: TokenBucketStorer,
  ) {}

  public checkToken(userId: string, currentTimestamp: number) {
    if (!this._bucketStorer.hasTokenBucketByUserId(userId)) {
      this._bucketStorer.initBucket({ userId, currentTimestamp, token: this._bucketSize });
    }

    this._refillTokens(userId, currentTimestamp);

    const tokens = this._bucketStorer.get(userId) as number;
    console.log(userId, tokens);

    if (tokens > 0) {
      this._bucketStorer.setToken(userId, tokens - 1);
    } else {
      throw new Error('too many requests');
    }
  }

  private _refillTokens(userId: string, currentTimestamp: number) {
    const lastRefillTime = this._bucketStorer.getLastRefill(userId) || currentTimestamp;

    const elaspedTime = currentTimestamp - lastRefillTime;

    if (elaspedTime >= 10 * 1000) {
      this._bucketStorer.setLastRefill(userId, currentTimestamp);
      this._bucketStorer.setToken(userId, this._bucketSize);
    }
  }
}
