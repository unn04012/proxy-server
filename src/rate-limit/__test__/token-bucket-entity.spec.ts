import { TokenBucket } from '../token-bucket-storer';
import { TokenBucketEntity } from '../token-bucket.entity';

function mockToeknBucketEntity({ tokens = 0, lastRefillTimestamp = 0, maxTokens = 10, refillRate = 10 }: Partial<TokenBucket>) {
  return TokenBucketEntity.from({ tokens, lastRefillTimestamp, maxTokens, refillRate });
}

describe('토큰 공급률이 초당 10개면서 최대 버킷 크기가 10인경우', () => {
  test('초당 처리율 10 버킷에 3개의 토큰이 있으며, 토큰을 요청한경우 1초를 기다려야 한다', () => {
    const tokenBucket = mockToeknBucketEntity({ tokens: 3 });

    const delaySeconds = tokenBucket.calculateDelayTimeForTokens(10);

    expect(delaySeconds).toBe(1);
  });

  test('초당 처리율이 9이며 버킷에 1개의 토큰이 있으며, 토큰을 요청한경우 딜레이가 없다.', () => {
    const tokenBucket = mockToeknBucketEntity({ tokens: 1 });

    const delaySeconds = tokenBucket.calculateDelayTimeForTokens(9);

    expect(delaySeconds).toBe(0);
  });

  test('현재 요청이 마지막 갱신시점보다 10초 뒤에 와도 최대 버킷 크기를 넘어서지는 않는다.', () => {
    const tokenBucket = mockToeknBucketEntity({ lastRefillTimestamp: 0 });

    const tenSecondsFromMilli = 10000;
    const addedToken = tokenBucket.calculateAddedTokens(tenSecondsFromMilli, 0);

    expect(addedToken).toBe(10);
  });

  test('현재 초당 처리율이 0이며 요청이 마지막 갱신시점이후 0.2초가 지났으면 2개가 생성된다.', () => {
    const current = new Date();
    const lastRefillTime = current.setMilliseconds(100);
    const currentTime = current.setMilliseconds(300);
    const tokenBucket = mockToeknBucketEntity({ lastRefillTimestamp: lastRefillTime });

    const addedToken = tokenBucket.calculateAddedTokens(currentTime, 0);

    expect(addedToken).toBe(2);
  });

  test('현재 초당 처리율이 10이상 요청이 올 경우 토큰이 생기면 안된다.', () => {
    const current = new Date();
    const lastRefillTime = current.setMilliseconds(100);
    const currentTime = current.setMilliseconds(300);
    const tokenBucket = mockToeknBucketEntity({ lastRefillTimestamp: lastRefillTime, tokens: 5 });

    const addedToken = tokenBucket.calculateAddedTokens(currentTime, 10);

    expect(addedToken).toBe(0);
  });
});
