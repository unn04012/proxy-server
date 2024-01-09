import { Module } from '@nestjs/common';
import { ApiThrolttlerManager } from './api-throttler.manager';
import { RateLimitTokenBucket } from './rate-limit-token-bucket';
import { UserRequestHistoryRepositoryCache } from './repository/user-request-history-repository-cache';
import { TokenBucketStorer } from './token-bucket-storer';

@Module({
  providers: [
    TokenBucketStorer,
    { provide: RateLimitTokenBucket, useFactory: () => new RateLimitTokenBucket(10, 10, new TokenBucketStorer()) },
    ApiThrolttlerManager,
  ],
  exports: [ApiThrolttlerManager],
})
export class RateLimitModule {}
