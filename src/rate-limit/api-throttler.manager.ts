import { Inject, Injectable } from '@nestjs/common';
import { Symbols } from 'src/symbols';
import { setTimeout } from 'timers/promises';
import { RateLimitTokenBucket } from './rate-limit-token-bucket';
import { IUserRequestHistoryRepository, UserRequest } from './repository/user-request-history-repository.interface';

@Injectable()
export class ApiThrolttlerManager {
  constructor(
    private readonly _apiThrottler: RateLimitTokenBucket,
    @Inject(Symbols.UserRequestHistory) private readonly _userRequestHistoryRepository: IUserRequestHistoryRepository,
    //TODO inject config module like ttl
  ) {}

  public setToken(userId: string) {
    const timestamp = Date.now();
    this._apiThrottler.checkToken(userId, timestamp);
  }
}
