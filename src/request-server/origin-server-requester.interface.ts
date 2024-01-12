import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OriginServerRequester {
  private readonly _logger = new Logger(OriginServerRequester.name);

  public async request(userId: string): Promise<void> {
    this._logger.log(`${userId} request success to origin server!! `);
  }
}
