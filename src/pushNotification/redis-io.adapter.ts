import { IoAdapter } from '@nestjs/platform-socket.io';
import * as redisIoAdapter from 'socket.io-redis';
import { EnvService } from '../../environment/env.service';

const config = new EnvService().read()
const redisAdapter = redisIoAdapter({ host: config.REDIS_HOST, port: config.REDIS_PORT, db:config.REDIS_DB, password: config.REDIS_PASSWORD });

export class RedisIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);
    server.adapter(redisAdapter);
    return server;
  }
}