import { Module,MiddlewareConsumer, HttpModule } from '@nestjs/common';
import { ApplicationStatusModule } from './applicationStatus/applicationStatus.module';
import { DatabaseModule } from '../environment/database.module';
import {ApplicationStatusMiddleware} from './middlewares/applicationstatus.middleware';
import { SocketModule } from './socket/socket.module';
import { logger } from './middlewares/logger.middleware';
import { SyncGatewayModule } from './syncGateway/syncGateway.module';

@Module({
  imports: [
    DatabaseModule, 
    ApplicationStatusModule,
    SyncGatewayModule,
    SocketModule,
    HttpModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApplicationStatusMiddleware)
      .forRoutes('application-status','sync-gateway')
      .apply(logger)
      .forRoutes('socket');
  }
}
