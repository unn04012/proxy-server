import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OriginServerRequester {
  private readonly _logger = new Logger(OriginServerRequester.name);

  public async request(someData: string): Promise<void> {
    this._logger.log('request success to origin server!!');
  }
}
