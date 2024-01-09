import { TokenBucket } from './token-bucket-storer';
import { TokenBucketEntity } from './token-bucket.entity';

function mockToeknBucketEntity({ tokens = 0, lastRefillTimestamp = 0, maxTokens = 10, refillRate = 10 }: Partial<TokenBucket>) {
  return TokenBucketEntity.from({ tokens, lastRefillTimestamp, maxTokens, refillRate });
}

describe('토큰 공급률이 초당 10개면서 최대 버킷 크기가 10인경우', () => {
  test('현재 요청이 마지막 갱신시점보다 10초 뒤에 와도 최대 버킷 크기를 넘어서지는 않는다.', () => {
    const tokenBucket = mockToeknBucketEntity({ lastRefillTimestamp: 0 });

    const tenSecondsFromMilli = 10000;
    const addedToken = tokenBucket.calculateAddedTokens(tenSecondsFromMilli);

    expect(addedToken).toBe(10);
  });

  test('현재 요청이 마지막 갱신시점보다 0.2초 후에 오면 2개가 추가되어야 한다.', () => {
    const tokenBucket = mockToeknBucketEntity({ lastRefillTimestamp: 0 });

    const secondsToMilli = 200;
    const addedToken = tokenBucket.calculateAddedTokens(secondsToMilli);

    expect(addedToken).toBe(2);
  });

  test('버킷에 토큰이 없으며 1개의 토큰을 요청할 경우 0.1초를 기다려야 한다. ', () => {
    const tokenBucket = mockToeknBucketEntity({ tokens: 0 });

    const delayTime = tokenBucket.calculateDelayTimeForTokens(1);

    expect(delayTime).toBe(0.1);
  });

  test('버킷에 있는 토큰 갯수가 요청한 토큰 갯수보다 많을 경우 딜레이 시간이 없다. ', () => {
    const tokenBucket = mockToeknBucketEntity({ tokens: 2 });

    const delayTime = tokenBucket.calculateDelayTimeForTokens(1);

    expect(delayTime).toBe(0);
  });
});
