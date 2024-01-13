import { CacheModule } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { RateLimitTokenBucket } from '../rate-limit-token-bucket';
import { TokenBucketStorer } from '../token-bucket-storer';

describe('TokenBucketManager', () => {
  let tokenBucketManager: RateLimitTokenBucket;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [TokenBucketStorer, { provide: RateLimitTokenBucket, useClass: RateLimitTokenBucket }],
    }).compile();

    tokenBucketManager = app.get<RateLimitTokenBucket>(RateLimitTokenBucket);
  });

  it('초당 처리율이 10을 넘어서는 안된다', async () => {
    const userId = 'test-user';
    const numRequests = 20; // 예상 초당 처리율을 넘을만큼의 요청을 보냄
    const startTime = Date.now();

    for (const _ of Array.from({ length: numRequests })) {
      await tokenBucketManager.checkRequest(userId, startTime);
    }

    const elapsedTime = Date.now() - startTime;

    // 예상 초당 처리율은 10이므로, elapsedTime이 1000ms를 초과해서는 안됨
    expect(numRequests / (elapsedTime / 1000)).toBeLessThanOrEqual(10);
  });
});
