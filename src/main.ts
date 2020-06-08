import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { join } from 'path';
const path = require('path');
import 'dotenv/config';
import * as fs from 'fs';

async function bootstrap() {
  // const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.useStaticAssets(join(__dirname, '..', 'static'));

  // const app = await NestFactory.create(AppModule);

  // const httpsOptions = {
  //   key: fs.readFileSync('./secrets/private-key.pem'),
  //   cert: fs.readFileSync('./secrets/public-certificate.pem'),
  // };
  // const httpsOptions = {
  //   key: fs.readFileSync(path.resolve('src/secrets/private-key.pem')),
  //   cert: fs.readFileSync(path.resolve('src/secrets/public-certificate.pem')),
  // };
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
}
bootstrap();
