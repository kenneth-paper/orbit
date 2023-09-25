import 'dotenv/config';
import { NewrelicInterceptor } from './newrelic.interceptor';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './pushNotification/redis-io.adapter';
const path = require('path');
import * as fs from 'fs';
import * as cluster from 'cluster';
import * as os from 'os';
import * as http from 'http';

async function bootstrap() {
  if (cluster.isMaster) {
    // Get the number of CPUs in the system
    const numCPUs = os.cpus().length;
  
    // Fork workers for each CPU
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
  
    // Listen for when a worker exits
    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
      cluster.fork();
    });
  } else {
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
    // start config: to handle payload too large
    var bodyParser = require('body-parser');
    app.use(bodyParser.json({limit: "50mb"}));
    app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
    // end config: to handle payload too large
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
}

bootstrap();