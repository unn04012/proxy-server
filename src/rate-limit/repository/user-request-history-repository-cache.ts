import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { IUserRequestHistoryRepository, UserRequest } from './user-request-history-repository.interface';

@Injectable()
export class UserRequestHistoryRepositoryCache implements IUserRequestHistoryRepository {
  constructor(@Inject(CACHE_MANAGER) private readonly _cacheManager: Cache) {}

  public async getLastUserRequest(userId: string): Promise<UserRequest | null> {
    const request = await this._cacheManager.get<UserRequest>(userId);

    return request ?? null;
  }

  public async setRequest({ userId, request, ttl }: { userId: string; request: UserRequest; ttl: number }): Promise<void> {
    await this._cacheManager.set(userId, request, ttl * 1000);
  }
}
