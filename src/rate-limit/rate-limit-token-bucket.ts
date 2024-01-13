import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { setTimeout } from 'timers/promises';
import { TokenBucketStorer } from './token-bucket-storer';
import { TokenBucketEntity } from './token-bucket.entity';

const REQEUST_COUNT = 1;
const ONE_SECOND = 1000; // 1 seconds

export type UserRequest = {
  count: number;
  lastRequestTime: number;
};

@Injectable()
export class RateLimitTokenBucket {
  constructor(
    private readonly _bucketStorer: TokenBucketStorer,
    @Inject(CACHE_MANAGER) private readonly _cacheManager: Cache,
  ) {}

  private async _getRequestCounter(userId: string): Promise<UserRequest> {
    const userCounter = await this._cacheManager.get<UserRequest>(userId);
    if (!userCounter) await this._cacheManager.set(userId, 0, ONE_SECOND);

    return userCounter ?? { lastRequestTime: 0, count: 0 };
  }

  public async checkRequest(userId: string, currentTimestamp: number) {
    const { count } = await this._getRequestCounter(userId);

    if (!this._bucketStorer.hasBucket(userId)) {
      this._bucketStorer.setBucket(userId, currentTimestamp);
    }
    const bucket = <TokenBucketEntity>this._bucketStorer.getBucket(userId);

    await this._refillBucket({ bucket, currentTimestamp, requestCount: count });

    bucket.useToken();

    this._bucketStorer.updateBucket(userId, bucket);

    await this._cacheManager.set(userId, count + REQEUST_COUNT);
  }

  private async _refillBucket({
    bucket,
    currentTimestamp,
    requestCount,
  }: {
    bucket: TokenBucketEntity;
    currentTimestamp: number;
    requestCount: number;
  }): Promise<void> {
    while (bucket.tokens < REQEUST_COUNT) {
      const waitForTokens = bucket.calculateDelayTimeForTokens(currentTimestamp);

      if (waitForTokens > 0) {
        await setTimeout(waitForTokens * 1000);
      }

      const delayedTimestamp = Date.now();

      const addedTokens = bucket.calculateAddedTokens(delayedTimestamp, requestCount);

      if (addedTokens > 0) {
        bucket.refillToken(addedTokens, currentTimestamp);
      }
    }
  }
}
