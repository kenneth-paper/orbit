import 'dotenv/config';
import { NewrelicInterceptor } from './newrelic.interceptor';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './pushNotification/redis-io.adapter';
const path = require('path');
import * as fs from 'fs';

async function bootstrap() {
  if (process.env.NODE_ENV == 'local') {
    const app = await NestFactory.create(AppModule);
    app.useWebSocketAdapter(new RedisIoAdapter(app));
    app.useGlobalInterceptors(new NewrelicInterceptor());
    app.enableCors({
      origin: true,
      methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      credentials: true,
      allowedHeaders:
        'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization,auth',
    });
    await app.listen(3000);
  } else if (process.env.NODE_ENV == 'development') {
    const app = await NestFactory.create(AppModule);
    app.useWebSocketAdapter(new RedisIoAdapter(app));
    app.useGlobalInterceptors(new NewrelicInterceptor());
    app.enableCors({
      origin: true,
      methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      credentials: true,
      allowedHeaders:
        'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization,auth',
    });
    await app.listen(3000);
  } else if (process.env.NODE_ENV == 'staging') {
    const app = await NestFactory.create(AppModule);
    app.useWebSocketAdapter(new RedisIoAdapter(app));
    app.useGlobalInterceptors(new NewrelicInterceptor());
    app.enableCors({
      origin: true,
      methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      credentials: true,
      allowedHeaders:
        'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization,auth',
    });
    await app.listen(3000);
  } else if (process.env.NODE_ENV == 'sandbox') {
    const app = await NestFactory.create(AppModule);
    app.useWebSocketAdapter(new RedisIoAdapter(app));
    app.useGlobalInterceptors(new NewrelicInterceptor());
    app.enableCors({
      origin: true,
      methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      credentials: true,
      allowedHeaders:
        'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization,auth',
    });
    await app.listen(3000);
  } else if (process.env.NODE_ENV == 'production') {
    const app = await NestFactory.create(AppModule);
    app.useWebSocketAdapter(new RedisIoAdapter(app));
    app.useGlobalInterceptors(new NewrelicInterceptor());
    app.enableCors({
      origin: true,
      methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      credentials: true,
      allowedHeaders:
        'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization,auth',
    });
    await app.listen(3000);
  } else {
    const httpsOptions = {
      key: fs.readFileSync(path.resolve('src/secrets/private-key.pem')),
      cert: fs.readFileSync(path.resolve('src/secrets/public-certificate.pem')),
    };

    const app = await NestFactory.create(AppModule, {
      httpsOptions,
    });

    app.useWebSocketAdapter(new RedisIoAdapter(app));
    app.useGlobalInterceptors(new NewrelicInterceptor());
    app.enableCors();
    await app.listen(3000);
  }
}

bootstrap();