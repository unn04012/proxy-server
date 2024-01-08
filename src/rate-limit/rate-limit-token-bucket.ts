import { Injectable } from '@nestjs/common';

@Injectable()
export class RateLimitTokenBucket {
  private readonly _tokenBucket: Map<string, number>;
  private readonly _lastRefill: Map<string, number>;

  constructor(private readonly _bucketSize: number) {
    this._tokenBucket = new Map();
    this._lastRefill = new Map();
  }

  public checkToken(userId: string, currentTimestamp: number) {
    if (!this._tokenBucket.has(userId)) {
      this._tokenBucket.set(userId, this._bucketSize);
      this._lastRefill.set(userId, currentTimestamp);
    }

    this._refillTokens(userId, currentTimestamp);

    const tokens = this._tokenBucket.get(userId) as number;

    if (tokens > 0) {
      this._tokenBucket.set(userId, tokens - 1);
    } else {
      throw new Error('too many requests');
    }
  }

  private _refillTokens(userId: string, currentTimestamp: number) {
    const lastRefillTime = this._lastRefill.get(userId) || currentTimestamp;

    const elaspedTime = currentTimestamp - lastRefillTime;

    if (elaspedTime >= 10 * 1000) {
      this._tokenBucket.set(userId, this._bucketSize);
      this._lastRefill.set(userId, currentTimestamp);
    }
  }
}
