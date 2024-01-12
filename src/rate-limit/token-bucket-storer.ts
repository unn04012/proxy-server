import { Injectable } from '@nestjs/common';
import { TokenBucketEntity } from './token-bucket.entity';

export type TokenBucket = {
  tokens: number;
  lastRefillTimestamp: number;
  maxTokens: number;
  refillRate: number;
  totalRequestCount: number;
  totalAccTime: number;
};

@Injectable()
export class TokenBucketStorer {
  private readonly _bucketSize = 10;
  private readonly _refillRatePerSecond = 10;
  private readonly _bucket: Map<string, TokenBucket>;

  constructor() {
    this._bucket = new Map();
  }

  public hasBucket(userId: string) {
    return this._bucket.has(userId);
  }

  public getBucket(userId: string) {
    const bucket = this._bucket.get(userId);
    // return bucket;
    return bucket ? TokenBucketEntity.from(bucket) : null;
  }

  public setBucket(userId: string, currentTimestamp: number) {
    const updateBucket: TokenBucket = {
      tokens: 0,
      lastRefillTimestamp: currentTimestamp,
      maxTokens: this._bucketSize,
      refillRate: this._refillRatePerSecond,
      totalRequestCount: 0,
    };
    this._bucket.set(userId, updateBucket);
  }

  public updateBucket(userId: string, bucket: TokenBucketEntity) {
    this._bucket.set(userId, bucket.forUpdate());
  }

  public all() {
    console.log(this._bucket);
    return this._bucket;
  }
}
