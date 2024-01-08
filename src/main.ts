import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

declare module 'express-serve-static-core' {
  interface Request {
    userId: string;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
