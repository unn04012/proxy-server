import { Module } from '@nestjs/common';
import { ApiThrolttlerManager } from './api-throttler.manager';
import { RateLimitTokenBucket } from './rate-limit-token-bucket';
import { UserRequestHistoryRepositoryCache } from './repository/user-request-history-repository-cache';
import { TokenBucketStorer } from './token-bucket-storer';

export const THROUGHPUT_PER_CEND = 10;

@Module({
  providers: [TokenBucketStorer, { provide: RateLimitTokenBucket, useClass: RateLimitTokenBucket }, ApiThrolttlerManager],
  exports: [ApiThrolttlerManager],
})
export class RateLimitModule {}
