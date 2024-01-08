import { Module } from '@nestjs/common';
import { Symbols } from 'src/symbols';
import { ApiThrolttlerManager } from './api-throttler.manager';
import { RateLimitTokenBucket } from './rate-limit-token-bucket';
import { UserRequestHistoryRepositoryCache } from './repository/user-request-history-repository-cache';

@Module({
  providers: [
    { provide: RateLimitTokenBucket, useFactory: () => new RateLimitTokenBucket(10) },
    ApiThrolttlerManager,
    { provide: Symbols.UserRequestHistory, useClass: UserRequestHistoryRepositoryCache },
  ],
  exports: [ApiThrolttlerManager],
})
export class RateLimitModule {}
