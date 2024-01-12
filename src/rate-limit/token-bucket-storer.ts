import { Injectable } from '@nestjs/common';
import { TokenBucketEntity } from './token-bucket.entity';

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

  public hasBucket(userId: string) {
    return this._bucket.has(userId);
  }

  public getBucket(userId: string) {
    const bucket = this._bucket.get(userId);
    return bucket;
    // return bucket ? TokenBucketEntity.from(bucket) : null;
  }

  public setBucket(userId: string, bucket: TokenBucket) {
    this._bucket.set(userId, bucket);
  }
}
