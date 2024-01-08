import { Injectable } from '@nestjs/common';

@Injectable()
export class OriginServerRequester {
  public async request(someData: string): Promise<void> {
    console.log('request success to origin server!!');
  }
}
