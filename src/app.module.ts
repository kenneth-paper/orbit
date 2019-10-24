import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationStatusModule } from './applicationStatus/applicationStatus.module';
import { AlertGateway, AlertController } from './app.gateway';
// import { DatabaseModule } from 'environment/database.module';
// import { EnvService } from 'environment/env.service';
import { DatabaseModule } from 'environment/database.module';

// function DatabaseOrmModule(): DynamicModule {
//   const config = new EnvService().read()

//   return TypeOrmModule.forRoot({
//     type: config.DB_TYPE,
//     host: config.DB_HOST,
//     port: config.DB_PORT,
//     username: config.DB_USER,
//     password: config.DB_PASSWORD,
//     database: config.DB_NAME,

//     synchronize: false
//   })
// }

@Module({
  imports: [DatabaseModule, ApplicationStatusModule],
  // imports: [
  //   TypeOrmModule.forRootAsync({
  //     useFactory: () => ({
  //       type: 'mysql',
  //       host: process.env.DB_HOST,
  //       port: parseInt(process.env.DB_PORT),
  //       username: process.env.DB_USER,
  //       password: process.env.DB_PASSWORD,
  //       database: process.env.DB_NAME,
  //       entities: [__dirname + '/**/*.entity{.ts,.js}'],
  //       synchronize: false
  //     })
  //   }),
  //   ApplicationStatusModule
  // ],
  controllers: [AlertController],
  providers: [AlertGateway],
})
export class AppModule { }
