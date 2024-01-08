import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RateLimitModule } from './rate-limit/rate-limit.module';
import { OriginServerRequester } from './request-server/origin-server-requester.interface';

@Module({
  imports: [RateLimitModule, CacheModule.register({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService, OriginServerRequester],
})
export class AppModule {}
