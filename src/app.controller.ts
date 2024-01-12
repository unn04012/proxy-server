import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //프록시 처리
  @Get()
  proxy(@Req() request: Request) {
    return this.appService.proxy(request.userId);
  }

  @Get('challenge1')
  challenge1(): number {
    return this.appService.challenge1();
  }

  @Get('challenge2')
  challenge2(): number {
    return this.appService.challenge2();
  }

  @Get('all')
  all(@Req() request: Request) {
    return this.appService.all(request.userId);
  }
}
