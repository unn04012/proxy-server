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
   * 마지막 갱신시점 기준으로 추가할 토큰을 계산후 갱신합니다.
   * @returns
   */
  public calculateAddedTokens(currentTimestamp: number) {
    const addedTokens = Math.min(this._maxTokens, Math.floor(((currentTimestamp - this._lastRefillTimestamp) * this._refillRate) / 1000));
    // console.log(addedTokens);
    // if (addedTokens > 0) {
    //   this._tokens += addedTokens;
    //   this._lastRefillTimestamp = currentTimestamp;
    // }

    return addedTokens;
  }

  /**
   * 추가된 토큰을 채웁니다.
   */
  public refillToken(addedToken: number, currentTimestamp: number) {
    this._tokens += addedToken;
    this._lastRefillTimestamp = currentTimestamp;
  }

  /**
   * 토큰을 공급받기 위한 딜레이 시간을 계삽합니다.
   */
  public calculateDelayTimeForTokens(requestToken: number) {
    const calculatedSeconds = Math.max((requestToken - this._tokens) / this._refillRate, 0);

    return calculatedSeconds;
  }

  public useToken(numToken: number) {
    const updatedToken = this._tokens - numToken;
    if (updatedToken < 0) throw new Error('cannot use more than token in the bucket');

    this._tokens -= numToken;
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
