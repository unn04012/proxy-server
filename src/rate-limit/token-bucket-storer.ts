import { Injectable } from '@nestjs/common';

type Timestamp = number;
type UserId = string;

export type TokenBucket = {
  token: number;
  lastRefillTimestamp: number;
};

@Injectable()
export class TokenBucketStorer {
  private readonly _tokenBucket: Map<string, number>;
  private readonly _lastRefillBucket: Map<string, number>;

  constructor() {
    this._tokenBucket = new Map();
    this._lastRefillBucket = new Map();
  }

  public initBucket({ userId, currentTimestamp, token }: { userId: string; currentTimestamp: number; token: number }) {
    this._tokenBucket.set(userId, token);
    this._lastRefillBucket.set(userId, currentTimestamp);
  }

  public hasTokenBucketByUserId(userId: string) {
    return this._tokenBucket.has(userId);
  }

  public get(userId: string) {
    return this._tokenBucket.get(userId);
  }
  public getLastRefill(userId: string) {
    return this._lastRefillBucket.get(userId);
  }

  public setLastRefill(userId: string, lastRefillTimestamp: number) {
    this._lastRefillBucket.set(userId, lastRefillTimestamp);
  }

  public setToken(userId: string, consumeToken: number) {
    this._tokenBucket.set(userId, consumeToken);
  }
}
