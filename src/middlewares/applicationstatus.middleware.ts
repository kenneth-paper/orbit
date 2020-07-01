import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { EnvService } from '../../environment/env.service';

@Injectable()
export class ApplicationStatusMiddleware implements NestMiddleware {
  private readonly env

  constructor(env: EnvService) {
    this.env = env
  }

	use(req: Request, res: Response, next: Function) {
	  let password = req.header('password');
		let currentPassword = this.env.read().API_HEADER_PASSWORD

		if (password != currentPassword) {
			return res.status(401).json({ 'errors': { 'code': 401, 'message': 'Invalid Request' } });
		}

		next();
	}
}
