import { Injectable } from '@nestjs/common';
import { TokenBucket, TokenBucketStorer } from './token-bucket-storer';

@Injectable()
export class RateLimitTokenBucket {
  constructor(
    private readonly _bucketSize: number,
    private readonly _refillRatePerSecond: number,
    private readonly _bucketStorer: TokenBucketStorer,
  ) {}

  public async getToken(userId: string, currentTimestamp: number) {
    let bucket = this._bucketStorer.getBucket(userId);
    if (!bucket) {
      bucket = {
        tokens: this._bucketSize,
        lastRefillTimestamp: currentTimestamp,
        maxTokens: this._bucketSize,
        refillRate: this._refillRatePerSecond,
      };
      this._bucketStorer.setBucket(userId, bucket);
    }

    await this._refillBucket(bucket, 1);

    bucket.tokens -= 1;
    this._bucketStorer.setBucket(userId, bucket);
  }

  private async _refillBucket(bucket: TokenBucket, numTokens: number): Promise<void> {
    while (bucket.tokens < numTokens) {
      const waitForTokens = Math.max((numTokens - bucket.tokens) / bucket.refillRate, 0);

      await this._delay(waitForTokens * 1000);
      const currentTimestamp = Date.now();

      const addedTokens = Math.min(bucket.maxTokens, Math.floor(((currentTimestamp - bucket.lastRefillTimestamp) * bucket.refillRate) / 1000));

      if (addedTokens > 0) {
        bucket.tokens += addedTokens;
        bucket.lastRefillTimestamp = currentTimestamp;
      }
    }
  }

  private async _delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
