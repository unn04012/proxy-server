import { Module } from '@nestjs/common';

import { RateLimitTokenBucket } from './rate-limit-token-bucket';
import { TokenBucketStorer } from './token-bucket-storer';

@Module({
  providers: [TokenBucketStorer, RateLimitTokenBucket],
  exports: [RateLimitTokenBucket],
})
export class RateLimitModule {}
