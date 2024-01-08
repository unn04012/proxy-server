export type UserRequest = {
  count: number;
};
export interface IUserRequestHistoryRepository {
  /**
   * 마지막 요청 정보를 반환합니다.
   * @param userId
   */
  getLastUserRequest(userId: string): Promise<UserRequest | null>;

  /**
   *
   * @param ttl seconds
   */
  setRequest({ userId, request, ttl }: { userId: string; request: UserRequest; ttl: number }): Promise<void>;
}
