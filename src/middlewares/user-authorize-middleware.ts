import { NestMiddleware } from '@nestjs/common';
import { Request } from 'express';

export class UserAuthorizeMiddleware implements NestMiddleware {
  public use(req: Request, res: any, next: (error?: any) => void) {
    const userId = req.headers.id;

    if (!userId || typeof userId !== 'string') throw new Error('no user');

    req.userId = userId;
    next();
  }
}
