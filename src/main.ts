"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const redis_io_adapter_1 = require("./pushNotification/redis-io.adapter");
const path = require('path');
require("dotenv/config");
const fs = require("fs");
async function bootstrap() {
  if (process.env.NODE_ENV == 'local') {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useWebSocketAdapter(new redis_io_adapter_1.RedisIoAdapter(app));
    app.enableCors({
      origin: true,
      methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      credentials: true,
      allowedHeaders: 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization,auth',
    });
    await app.listen(3000);
  } else {
    const httpsOptions = {
      key: fs.readFileSync(path.resolve('src/secrets/private-key.pem')),
      cert: fs.readFileSync(path.resolve('src/secrets/public-certificate.pem')),
    };
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
      httpsOptions,
    });
    app.useWebSocketAdapter(new redis_io_adapter_1.RedisIoAdapter(app));
    app.enableCors();
    await app.listen(3000);
  }
}
bootstrap();
//# sourceMappingURL=main.js.map