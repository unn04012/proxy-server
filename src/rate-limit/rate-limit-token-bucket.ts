import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { setTimeout } from 'timers/promises';
import { TokenBucketStorer } from './token-bucket-storer';
import { TokenBucketEntity } from './token-bucket.entity';

const REQEUST_NUM_TOKEN = 1;
const ONE_SECOND = 1000; // 1 seconds

export type UserRequest = {
  count: number;
  lastRequestTime: number;
};

@Injectable()
export class RateLimitTokenBucket {
  private readonly _logger = new Logger(RateLimitTokenBucket.name);

  constructor(
    private readonly _bucketStorer: TokenBucketStorer,
    @Inject(CACHE_MANAGER) private readonly _cacheManager: Cache,
  ) {}

  private async _getRequestCounter(userId: string): Promise<UserRequest> {
    const userCounter = await this._cacheManager.get<UserRequest>(userId);
    if (!userCounter) await this._cacheManager.set(userId, REQEUST_NUM_TOKEN, ONE_SECOND);

    return userCounter ?? { lastRequestTime: 0, count: 0 };
  }

  public async getToken(userId: string, currentTimestamp: number) {
    const { count, lastRequestTime } = await this._getRequestCounter(userId);

    if (!this._bucketStorer.hasBucket(userId)) {
      this._bucketStorer.setBucket(userId, currentTimestamp);
    }
    const bucket = <TokenBucketEntity>this._bucketStorer.getBucket(userId);

    await this._refillBucket(bucket, 1, userId);

    bucket.useToken(cu);

    this._bucketStorer.updateBucket(userId, bucket);

    await this._cacheManager.set(userId, requestCount + 1);
  }

  private async _refillBucket(bucket: TokenBucketEntity, numTokens: number, userId: string): Promise<void> {
    while (bucket.tokens < numTokens) {
      const counter = await this._getRequestCounter(userId);
      const waitForTokens = bucket.calculateDelayTimeForTokens(counter);
      console.log(`${userId} delayed for ${waitForTokens} seconds`);
      if (waitForTokens > 0) {
        await setTimeout(waitForTokens * 1000);
      }

      const currentTimestamp = Date.now();

      const addedTokens = bucket.calculateAddedTokens(currentTimestamp, counter);
      // console.log(userId, waitForTokens, addedTokens);

      if (addedTokens > 0) {
        bucket.refillToken(addedTokens, currentTimestamp);
      }
    }
  }
}
