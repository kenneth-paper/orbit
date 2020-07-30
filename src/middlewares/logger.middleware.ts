import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
    console.log(`===============Request===============`);
    console.log(`path :`,req.originalUrl);
    console.log(`methode :`, req.method);
    console.log(`body :`, req.body);
    if (req.headers.user) {
      console.log(`user :`, req.headers.user);
    }
    console.log(`=====================================`);
    next();
  }