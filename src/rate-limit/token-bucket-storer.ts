import { Injectable } from '@nestjs/common';

export type TokenBucket = {
  tokens: number;
  lastRefillTimestamp: number;
  maxTokens: number;
  refillRate: number;
};

@Injectable()
export class TokenBucketStorer {
  private readonly _bucket: Map<string, TokenBucket>;

  constructor() {
    this._bucket = new Map();
  }

  public getBucket(userId: string) {
    return this._bucket.get(userId);
  }

  public setBucket(userId: string, bucket: TokenBucket) {
    this._bucket.set(userId, bucket);
  }
}
