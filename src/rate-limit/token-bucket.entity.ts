import { TokenBucket } from './token-bucket-storer';

export class TokenBucketEntity {
  private constructor(
    private _tokens: number,
    private _lastRefillTimestamp: number,
    private _maxTokens: number,
    private _refillRate: number,
  ) {}

  static from(param: TokenBucket) {
    const { tokens, lastRefillTimestamp, maxTokens, refillRate } = param;
    return new TokenBucketEntity(tokens, lastRefillTimestamp, maxTokens, refillRate);
  }

  get tokens() {
    return this._tokens;
  }

  /**
   * 마지막 갱신시점 기준으로 추가할 토큰을 계산합니다.
   * @param counter 1초 안에 발생한 요청 수
   * @returns
   */
  public calculateAddedTokens(currentTimestamp: number, counter: number) {
    if (counter >= this._refillRate) return 0;
    const elapsedTime = currentTimestamp - this._lastRefillTimestamp;

    const averageAddedToken = this._refillRate * (elapsedTime / 1000); // 평균 공급받을 토큰

    const tokensToAdd = Math.min(this._maxTokens, Math.floor(averageAddedToken));

    return tokensToAdd;
  }

  /**
   * 추가된 토큰을 채웁니다.
   */
  public refillToken(addedToken: number, currentTimestamp: number) {
    this._tokens += addedToken;
    this._lastRefillTimestamp = currentTimestamp;
  }

  /**
   * 1개의 토큰을 공급받기 위한 최대 딜레이 시간을 계산합니다.
   * @param counter 현재 초당 처리율
   * @return 지연 시간
   */
  public calculateDelayTimeForTokens(counter: number) {
    const ONE_SECOND = 1;

    if (counter >= this._refillRate) return ONE_SECOND;

    const calculatedSeconds = Math.max((1 - this._tokens) / this._refillRate, 0);

    return calculatedSeconds;
  }

  /**
   * 1개의 토큰을 사용합니다.
   * @param currentTimestamp number
   */
  public useToken() {
    const updatedToken = this._tokens - 1;
    if (updatedToken < 0) throw new Error('cannot use more than token in the bucket');

    this._tokens -= 1;
  }

  public forUpdate(): TokenBucket {
    return {
      tokens: this._tokens,
      maxTokens: this._maxTokens,
      lastRefillTimestamp: this._lastRefillTimestamp,
      refillRate: this._refillRate,
    };
  }
}
